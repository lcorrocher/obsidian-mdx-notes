import { Plugin, normalizePath, TAbstractFile, Menu } from 'obsidian';

export default class MdxTools extends Plugin {

	async onload() {
		console.log("MdxTools plugin loaded");
		this.registerExtensions(["mdx"], "markdown");

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				this.addNewFileSubmenu(menu, file);
			})
		);

		this.registerEvent(
			this.app.workspace.on("folder-menu", (menu, folder) => {
				this.addNewFileSubmenu(menu, folder);
			})
		);
	}

	addNewFileSubmenu(menu: Menu, fileOrFolder: TAbstractFile) {
		const folder = this.resolveFolder(fileOrFolder);

		menu.addSeparator();
		menu.addItem(item => {
		item.setTitle("New .md file")
			.onClick(() => this.createFile(folder, "md"));
		});

		menu.addItem(item => {
	    item.setTitle("New .mdx file")
		    .onClick(() => this.createFile(folder, "mdx"));
		});
	}

	resolveFolder(fileOrFolder: TAbstractFile): string {
		if ("children" in fileOrFolder) {
			return fileOrFolder.path;
		}
		return fileOrFolder.parent?.path ?? '/';
	}

	createFile(folder: string, ext: "md" | "mdx") {
		const baseName = "Untitled";
		let i = 0;
		let filename: string;

		const filesInFolder = this.app.vault.getFiles().filter(file => {
			return file.parent?.path === folder || file.path.startsWith(folder + "/");
		});

		while (true) {
			filename = i === 0 ? `${baseName}.${ext}` : `${baseName} ${i}.${ext}`;
			const filepath = normalizePath(`${folder}/${filename}`);
			const exists = filesInFolder.some(file => {
				const fName = file.path.split("/").pop();
				if (!fName) return false;
				const nameOnly = fName.replace(/\.[^/.]+$/, "");
				return nameOnly === (i === 0 ? baseName : `${baseName} ${i}`);
			});

			if (!exists) {
				this.app.vault.create(filepath, "");
				break;
			}
			i++;
		}
	}
}
