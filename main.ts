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

		this.addRibbonIcon("document", "Create test MDX", () => {
        const folder = this.app.vault.getRoot().path;
        this.createFile(folder, "mdx");
        console.log("Test MDX file created in folder:", folder);
    });
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
		let base = `Untitled.${ext}`;
		let filepath = normalizePath(`${folder}/${base}`);

		if (!this.app.vault.getAbstractFileByPath(filepath)) {
			this.app.vault.create(filepath, "");
			return;
		}

		let i = 1;
		while (true) {
			filepath = normalizePath(`${folder}/Untitled ${i}.${ext}`);
			if (!this.app.vault.getAbstractFileByPath(filepath)) {
				this.app.vault.create(filepath, "");
				break;
			}
			i++;
		}
	}
}
