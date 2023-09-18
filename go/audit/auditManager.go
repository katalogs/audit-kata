package audit

import (
	"path"
	"sort"
	"strconv"
	"time"
)

type AuditManager struct {
	maxEntriesPerFile int
	directoryName     string
	fileSystem        IFileSystem
}

func NewAuditManager(maxEntriesPerFile int, directoryName string, fileSystem IFileSystem) *AuditManager {
	return &AuditManager{
		maxEntriesPerFile: maxEntriesPerFile,
		directoryName:     directoryName,
		fileSystem:        fileSystem,
	}
}

func (am *AuditManager) AddRecord(visitorName string, timeOfVisit time.Time) {
	filePaths := am.fileSystem.getFiles(am.directoryName)
	sort.Strings(filePaths)
	newRecord := visitorName + ";" + timeOfVisit.Format("2006-01-02 15:04:05")

	if len(filePaths) == 0 {
		newFile := path.Join(am.directoryName, "audit_1.txt")
		am.fileSystem.writeAllText(newFile, newRecord)
		return
	}

	currentFileIndex := len(filePaths) - 1
	currentFilePath := filePaths[currentFileIndex]
	lines := am.fileSystem.readAllLines(currentFilePath)

	if len(lines) < am.maxEntriesPerFile {
		lines = append(lines, newRecord)
		newContent := ""
		for _, line := range lines {
			newContent += line
			newContent += "\n"
		}
		am.fileSystem.writeAllText(currentFilePath, newContent)
	} else {
		newName := "audit_" + strconv.Itoa(currentFileIndex+2) + ".txt"
		newFile := path.Join(am.directoryName, newName)
		am.fileSystem.writeAllText(newFile, newRecord)
	}
}
