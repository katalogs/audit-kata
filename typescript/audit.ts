import path from "path";

export interface FileSystem {
  getFiles(directoryName: string): string[];
  writeAllText(filePath: string, content: string): void;
  readAllLines(filePath: string): string[];
}

export class AuditManager {
  private maxEntriesPerFile: number;
  private directoryName: string;
  private fileSystem: FileSystem;

  constructor(maxEntriesPerFile: number, directoryName: string, fileSystem: FileSystem) {
    this.maxEntriesPerFile = maxEntriesPerFile;
    this.directoryName = directoryName;
    this.fileSystem = fileSystem;
  }

  addRecord(visitorName: string, timeOfVisit: Date): void {
    const filePaths = this.fileSystem.getFiles(this.directoryName);
    const sortedPaths = AuditManager.sortByIndex(filePaths);
    const newRecord = `${visitorName};${timeOfVisit
      .toISOString()
      .replace("T", " ")
      .substring(0, 19)}`;

    if (sortedPaths.length === 0) {
      const newFile = path.join(this.directoryName, "audit_1.txt");
      this.fileSystem.writeAllText(newFile, newRecord);
      return;
    }

    const [currentFileIdx, currFilePath] = sortedPaths[sortedPaths.length - 1];
    const lines = this.fileSystem.readAllLines(currFilePath);

    if (lines.length < this.maxEntriesPerFile) {
      lines.push(newRecord);
      const newContent = lines.join("\n");
      this.fileSystem.writeAllText(currFilePath, newContent);
    } else {
      const newIndex = currentFileIdx + 1;
      const newName = `audit_${newIndex}.txt`;
      const newFile = path.join(this.directoryName, newName);
      this.fileSystem.writeAllText(newFile, newRecord);
    }
  }

  static sortByIndex(filePaths: string[]): [number, string][] {
    return filePaths.sort().map((path, index) => [index + 1, path]);
  }
}
