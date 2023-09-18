package audit

import (
	"github.com/stretchr/testify/mock"
	"testing"
	"time"
)

func TestAddNewVisitorToANewFileWhenEndOfLastFileIsReached(t *testing.T) {
	fileSystemMock := &MockFileSystem{}

	fileSystemMock.On("getFiles", "audits").Return([]string{
		"audits/audit_2.txt",
		"audits/audit_1.txt",
	})

	fileSystemMock.On("readAllLines", "audits/audit_2.txt").Return([]string{
		"Peter;2019-04-06 16:30:00",
		"Jane;2019-04-06 16:40:00",
		"Jack;2019-04-06 17:00:00",
	})

	fileSystemMock.On("writeAllText", "audits/audit_3.txt", "Alice;2019-04-06 18:00:00")

	sut := NewAuditManager(3, "audits", fileSystemMock)

	sut.AddRecord("Alice", time.Date(2019, 4, 6, 18, 0, 0, 0, time.Local))

	fileSystemMock.AssertExpectations(t)
}

type MockFileSystem struct {
	mock.Mock
}

func (m *MockFileSystem) getFiles(directoryName string) []string {
	args := m.Called(directoryName)
	return args.Get(0).([]string)
}

func (m *MockFileSystem) writeAllText(filePath string, content string) {
	m.Called(filePath, content)
}

func (m *MockFileSystem) readAllLines(filePath string) []string {
	args := m.Called(filePath)
	return args.Get(0).([]string)
}
