import path from "path";

export class FileSystem {
  getFiles(_directoryName) {
    throw new Error("Method not implemented");
  }

  writeAllText(_filePath, _content) {
    throw new Error("Method not implemented");
  }

  readAllLines(_filePath) {
    throw new Error("Method not implemented");
  }
}

export class AuditManager {
  constructor(maxEntriesPerFile, directoryName, fileSystem) {
    this.maxEntriesPerFile = maxEntriesPerFile;
    this.directoryName = directoryName;
    this.fileSystem = fileSystem;
  }

  addRecord(visitorName, timeOfVisit) {
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

  static sortByIndex(filePaths) {
    return filePaths.sort().map((path, index) => [index + 1, path]);
  }
}
