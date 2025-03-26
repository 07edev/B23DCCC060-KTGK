import { useState, useCallback } from 'react';
import { message } from 'antd';
import { Classroom, ClassroomState, ClassroomModel } from './classroom';
import { getClassrooms, addClassroom, updateClassroom, deleteClassroom } from '@/services/classroomService';

export default function useClassroomModel(): ClassroomModel {
  const [state, setState] = useState<ClassroomState>({
    classrooms: [],
    loading: false,
    error: null,
  });

  const fetchClassrooms = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await getClassrooms();
      setState(prev => ({ ...prev, classrooms: data, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách phòng học',
      }));
      message.error('Có lỗi xảy ra khi tải danh sách phòng học');
    }
  }, []);

  const handleAddClassroom = useCallback(async (classroom: Omit<Classroom, 'id'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const newClassroom = await addClassroom(classroom);
      setState(prev => ({
        ...prev,
        classrooms: [...prev.classrooms, newClassroom],
        loading: false,
      }));
      message.success('Thêm phòng học thành công');
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm phòng học',
      }));
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm phòng học');
      throw error;
    }
  }, []);

  const handleUpdateClassroom = useCallback(async (id: string, classroom: Partial<Classroom>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const updatedClassroom = await updateClassroom(id, classroom);
      setState(prev => ({
        ...prev,
        classrooms: prev.classrooms.map(c => c.id === id ? updatedClassroom : c),
        loading: false,
      }));
      message.success('Cập nhật phòng học thành công');
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật phòng học',
      }));
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật phòng học');
      throw error;
    }
  }, []);

  const handleDeleteClassroom = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteClassroom(id);
      setState(prev => ({
        ...prev,
        classrooms: prev.classrooms.filter(c => c.id !== id),
        loading: false,
      }));
      message.success('Xóa phòng học thành công');
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phòng học',
      }));
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phòng học');
      throw error;
    }
  }, []);

  const setClassrooms = useCallback((classrooms: Classroom[]) => {
    setState(prev => ({ ...prev, classrooms }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    state,
    effects: {
      fetchClassrooms,
      addClassroom: handleAddClassroom,
      updateClassroom: handleUpdateClassroom,
      deleteClassroom: handleDeleteClassroom,
    },
    reducers: {
      setClassrooms,
      setLoading,
      setError,
    },
  };
} 