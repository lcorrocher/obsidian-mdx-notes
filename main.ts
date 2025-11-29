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

		this.addRibbonIcon("document", "Create new note", (evt: MouseEvent) => {
			const menu = new Menu();
			const folder = this.app.vault.getRoot().path;
			menu.addItem(item =>
				item.setTitle("New .md note").onClick(() => this.createFile(folder, "md"))
			);
			menu.addItem(item =>
				item.setTitle("New .mdx note").onClick(() => this.createFile(folder, "mdx"))
			);
			menu.showAtMouseEvent(evt);
		});
	}

	addNewFileSubmenu(menu: Menu, fileOrFolder: TAbstractFile) {
		const folder = this.resolveFolder(fileOrFolder);

		menu.addItem(item => {
	    item.setTitle("New .mdx note")
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
			return (file.parent?.path === folder || file.path.startsWith(folder + "/"))
				&& file.path.endsWith(`.${ext}`);
		});
		while (true) {
			filename = i === 0 ? `${baseName}.${ext}` : `${baseName} ${i}.${ext}`;
			const filepath = normalizePath(`${folder}/${filename}`);

			const exists = filesInFolder.some(file => {
				const fName = file.path.split("/").pop();
				return fName === filename;
			});

			if (!exists) {
				this.app.vault.create(filepath, "");
				break;
			}
			i++;
		}
	}
}
