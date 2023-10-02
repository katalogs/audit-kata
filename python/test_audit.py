from datetime import datetime
from unittest.mock import Mock
from audit import AuditManager, FileSystem


def test__audit__create_file__when_current_file_overflows(monkeypatch):
    # Arrange
    file_system_mock = Mock(
        spec_set=FileSystem,
    )
    monkeypatch.setattr(file_system_mock, 'get_files', lambda x: [
        "audits/audit_2.txt", "audits/audit_1.txt"
    ])
    monkeypatch.setattr(file_system_mock, 'read_all_lines', lambda x: [
        "Peter;2019-04-06 16:30:00",
        "Jane;2019-04-06 16:40:00",
        "Jack;2019-04-06 17:00:00"
    ])
    sut = AuditManager(3, 'audits', file_system_mock)

    # Act
    sut.add_record('Alice', datetime.fromisoformat('2019-04-06T18:00:00'))

    # Assert
    file_system_mock.write_all_text.assert_called_with("audits/audit_3.txt", "Alice;2019-04-06 18:00:00")
