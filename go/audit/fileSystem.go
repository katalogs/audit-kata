package audit

type IFileSystem interface {
	getFiles(directoryName string) []string
	writeAllText(filePath string, content string)
	readAllLines(filePath string) []string
}
