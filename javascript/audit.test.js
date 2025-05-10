import { describe, it, expect, vi } from 'vitest';
import { AuditManager } from './audit.js';
import path from 'path';

describe('AuditManager', () => {
  it('creates a new file when the current file overflows', () => {
    // Arrange
    const fileSystemMock = {
      getFiles: vi.fn(),
      writeAllText: vi.fn(),
      readAllLines: vi.fn()
    };
    fileSystemMock.getFiles.mockReturnValue([
      path.join('audits', 'audit_1.txt'),
      path.join('audits', 'audit_2.txt')
    ]);
    fileSystemMock.readAllLines.mockReturnValue([
      'Peter;2019-04-06 16:30:00',
      'Jane;2019-04-06 16:40:00',
      'Jack;2019-04-06 17:00:00'
    ]);
    const auditManager = new AuditManager(3, 'audits', fileSystemMock);

    // Act
    auditManager.addRecord('Alice', new Date('2019-04-06T18:00:00Z'));

    // Assert
    expect(fileSystemMock.writeAllText).toHaveBeenCalledWith(
      path.join('audits', 'audit_3.txt'),
      'Alice;2019-04-06 18:00:00'
    );
  });
});
