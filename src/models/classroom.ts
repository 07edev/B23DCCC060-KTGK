export type RoomType = 'Lý thuyết' | 'Thực hành' | 'Hội trường';

export interface Classroom {
  id: string;
  code: string;
  name: string;
  capacity: number;
  type: RoomType;
  manager: string;
}

export interface ClassroomState {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
}

export interface ClassroomModel {
  state: ClassroomState;
  effects: {
    fetchClassrooms: () => Promise<void>;
    addClassroom: (classroom: Omit<Classroom, 'id'>) => Promise<void>;
    updateClassroom: (id: string, classroom: Partial<Classroom>) => Promise<void>;
    deleteClassroom: (id: string) => Promise<void>;
  };
  reducers: {
    setClassrooms: (classrooms: Classroom[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
} 