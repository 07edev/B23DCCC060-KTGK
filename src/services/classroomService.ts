import { Classroom, RoomType } from '@/models/classroom';

const STORAGE_KEY = 'classrooms';

// Lấy dữ liệu từ localStorage khi khởi động
let classrooms: Classroom[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export const getClassrooms = async (): Promise<Classroom[]> => {
  return classrooms;
};

export const saveClassrooms = async (newClassrooms: Classroom[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClassrooms));
    classrooms = newClassrooms;
  } catch (error) {
    throw new Error('Có lỗi xảy ra khi lưu dữ liệu vào localStorage');
  }
};

export const addClassroom = async (classroom: Omit<Classroom, 'id'>): Promise<Classroom> => {
  try {
    // Validate classroom
    const validationError = validateClassroom(classroom);
    if (validationError) {
      throw new Error(validationError);
    }

    // Check for duplicate name
    if (isDuplicateName(classroom.name)) {
      throw new Error('Tên phòng đã tồn tại');
    }

    const newClassroom: Classroom = {
      ...classroom,
      id: Math.random().toString(36).substr(2, 9),
    };

    // Thêm phòng mới vào mảng hiện tại
    const updatedClassrooms = [...classrooms, newClassroom];
    await saveClassrooms(updatedClassrooms);
    return newClassroom;
  } catch (error) {
    throw error;
  }
};

export const updateClassroom = async (id: string, classroom: Partial<Classroom>): Promise<Classroom> => {
  try {
    const index = classrooms.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng học');
    }

    // Validate classroom
    const validationError = validateClassroom(classroom as Omit<Classroom, 'id'>);
    if (validationError) {
      throw new Error(validationError);
    }

    // Check for duplicate name
    if (isDuplicateName(classroom.name!, id)) {
      throw new Error('Tên phòng đã tồn tại');
    }

    const updatedClassroom: Classroom = {
      ...classrooms[index],
      ...classroom,
      id,
    };

    // Cập nhật phòng trong mảng hiện tại
    const updatedClassrooms = [...classrooms];
    updatedClassrooms[index] = updatedClassroom;
    await saveClassrooms(updatedClassrooms);
    return updatedClassroom;
  } catch (error) {
    throw error;
  }
};

export const deleteClassroom = async (id: string): Promise<void> => {
  try {
    const index = classrooms.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng học');
    }

    const classroom = classrooms[index];
    if (classroom.capacity >= 30) {
      throw new Error('Không thể xóa phòng có sức chứa từ 30 chỗ ngồi trở lên');
    }

    // Xóa phòng khỏi mảng hiện tại
    const updatedClassrooms = classrooms.filter(c => c.id !== id);
    await saveClassrooms(updatedClassrooms);
  } catch (error) {
    throw error;
  }
};

const validateClassroom = (classroom: Omit<Classroom, 'id'>): string | null => {
  // Kiểm tra mã phòng
  if (!classroom.code) {
    return 'Vui lòng nhập mã phòng';
  }
  if (classroom.code.length > 10) {
    return 'Mã phòng không được vượt quá 10 ký tự';
  }

  // Kiểm tra tên phòng
  if (!classroom.name) {
    return 'Vui lòng nhập tên phòng';
  }
  if (classroom.name.length > 50) {
    return 'Tên phòng không được vượt quá 50 ký tự';
  }

  // Kiểm tra người phụ trách
  if (!classroom.manager) {
    return 'Vui lòng chọn người phụ trách';
  }

  // Kiểm tra số chỗ ngồi
  if (!classroom.capacity) {
    return 'Vui lòng nhập số chỗ ngồi';
  }
  if (classroom.capacity < 1) {
    return 'Số chỗ ngồi phải lớn hơn 0';
  }

  // Kiểm tra loại phòng
  if (!classroom.type) {
    return 'Vui lòng chọn loại phòng';
  }
  if (!['Lý thuyết', 'Thực hành', 'Hội trường'].includes(classroom.type)) {
    return 'Loại phòng không hợp lệ';
  }

  return null;
};

const isDuplicateName = (name: string, excludeId?: string): boolean => {
  return classrooms.some(c => c.name === name && (!excludeId || c.id !== excludeId));
}; 