import abc
import os.path
from datetime import datetime
from typing import Any


class FileSystem(abc.ABC):
    @abc.abstractmethod
    def get_files(self, dir_name: str):
        raise NotImplementedError

    @abc.abstractmethod
    def write_all_text(self, new_file: str, content: str):
        raise NotImplementedError

    @abc.abstractmethod
    def read_all_lines(self, path: str):
        raise NotImplementedError


class AuditManager:
    def __init__(self, max_entries_per_file: int, directory_name: str, file_system: FileSystem):
        self._max_entries_per_file = max_entries_per_file
        self._directory_name = directory_name
        self._file_system = file_system

    def add_record(self, visitor_name: str, time_of_visit: datetime):
        file_paths = self._file_system.get_files(self._directory_name)
        sorted_paths = self._sort_by_index(file_paths)
        new_record = visitor_name + ';' + time_of_visit.strftime("%Y-%m-%d %H:%M:%S")

        if len(sorted_paths) == 0:
            new_file = os.path.join(self._directory_name, 'audit_1.txt')
            self._file_system.write_all_text(new_file, new_record)
            return

        current_file_index, curr_file_path = sorted_paths[-1]
        lines = self._file_system.read_all_lines(curr_file_path)

        if len(lines) < self._max_entries_per_file:
            lines.append(new_record)
            new_content = '\n'.join(lines)
            self._file_system.write_all_text(curr_file_path, new_content)
        else:
            new_index = current_file_index + 1
            new_name = f'audit_{new_index}.txt'
            new_file = os.path.join(self._directory_name, new_name)
            self._file_system.write_all_text(new_file, new_record)

    @staticmethod
    def _sort_by_index(file_paths) -> list[tuple[Any, Any]]:
        return list(enumerate(sorted(file_paths), start=1))
