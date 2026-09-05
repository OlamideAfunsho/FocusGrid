"use client";

import React, { useEffect, useState } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  Trash2Icon, 
  PencilIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  XIcon 
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

interface CourseOption {
  id: string;
  name: string;
  course_code: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  course_id: string;
  created_at: string;
  courses: CourseOption | null;
}

const NotesPage = () => {
  const { session, isLoaded } = useSession();
  const supabase = createBrowserClient(session);

  // Data State
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Viewing State
  const [viewingNote, setViewingNote] = useState<NoteItem | null>(null);
  
  // Interactive UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);

  // Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // 1. Fetch Notes and Courses Concurrently
  useEffect(() => {
    if (!isLoaded || !session) return;

    const fetchPageData = async () => {
      setLoading(true);
      try {
        const [notesRes, coursesRes] = await Promise.all([
          supabase
            .from('notes')
            .select(`
              id,
              title,
              content,
              course_id,
              created_at,
              courses (id, name, course_code)
            `)
            .eq('user_id', session.user.id),
          supabase.from('courses').select('id, name, course_code')
        ]);

        if (notesRes.error) throw notesRes.error;
        if (coursesRes.error) throw coursesRes.error;

        setNotes((notesRes.data as unknown as NoteItem[]) || []);
        setCourses(coursesRes.data || []);
      } catch (error) {
        console.error('Error fetching notes data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [session, isLoaded]);

  // Modal handlers
  const openCreateModal = () => {
    setActiveNote(null);
    setNoteTitle('');
    setSelectedCourseId('');
    setNoteContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteItem) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setSelectedCourseId(note.course_id);
    setNoteContent(note.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveNote(null);
  };

  // 2. Create or Update Handler
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !selectedCourseId) return;

    if (activeNote) {
      // Update existing note
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: noteTitle,
          content: noteContent,
          course_id: selectedCourseId,
        })
        .eq('id', activeNote.id)
        .select(`
          id, title, content, course_id, created_at,
          courses (id, name, course_code)
        `)
        .single();

      if (!error && data) {
        setNotes(prev =>
          prev.map(item => (item.id === activeNote.id ? (data as unknown as NoteItem) : item))
        );
        closeModal();
      }
    } else {
      // Create new note
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: noteTitle,
          content: noteContent,
          course_id: selectedCourseId,
          user_id: session.user.id,
        })
        .select(`
          id, title, content, course_id, created_at,
          courses (id, name, course_code)
        `)
        .single();

      if (!error && data) {
        setNotes(prev => [data as unknown as NoteItem, ...prev]);
        closeModal();
      }
    }
  };

  // 3. Delete Handler
  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (!error) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  // Filter logic
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = 
      selectedCourseFilter === 'ALL' || note.course_id === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl">
            Notes
          </h1>
          <p className="text-sm text-[#6C7278] mt-1">
            Capture, organize, and review your lecture notes and course summaries.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white px-4 py-2.5 rounded-[8px] text-sm font-medium cursor-pointer hover:opacity-90 transition shadow-md"
        >
          <PlusIcon className="w-4 h-4" />
          Create Note
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between mt-4 mb-4">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F98A3]" />
          <input
            type="text"
            placeholder="Search notes by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-semibold text-[#3E3A72] whitespace-nowrap">
            Filter by Course:
          </label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="w-full md:w-56 py-2 px-1 bg-white border border-neutral-200 rounded-[8px] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
          >
            <option value="ALL">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl text-center">
          <BookOpenIcon className="w-12 h-12 text-neutral-300 mb-3" />
          <h3 className="text-lg font-semibold text-[#3E3A72]">No notes found</h3>
          <p className="text-sm text-[#8F98A3] max-w-sm mt-1">
            Try adjusting your search criteria or create a new note for your classes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setViewingNote(note)}
              className="group bg-white border border-neutral-200 cursor-pointer hover:border-[#3399FF]/50 rounded-[8px] p-5 flex flex-col justify-between transition shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EEF2FF] text-[#3399FF]">
                    <BookOpenIcon className="w-3 h-3" />
                    {note.courses?.course_code ?? 'No Course'}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the view modal    
                        openEditModal(note);
                      }}
                      className="p-1.5 text-[#8F98A3] cursor-pointer hover:text-[#3399FF] rounded-lg transition"
                      title="Edit Note"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1.5 text-[#8F98A3] cursor-pointer hover:text-red-500 rounded-lg transition"
                      title="Delete Note"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-base text-neutral-900 line-clamp-1 mb-2">
                  {note.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-4 leading-relaxed mb-4">
                  {note.content}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-[#8F98A3]">
                <span className="truncate max-w-[180px]">{note.courses?.name ?? 'No Course'}</span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(note.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Side Panel: View Note Details */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setViewingNote(null)}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-full sm:w-[480px] bg-white shadow-2xl border-l border-neutral-100 flex flex-col">
              
              {/* Panel Header */}
              <div className="p-6 border-b border-neutral-100 flex items-start justify-between gap-4 bg-neutral-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EEF2FF] text-[#3399FF]">
                      <BookOpenIcon className="w-3.5 h-3.5" />
                      {viewingNote.courses?.course_code ?? 'No Course'}
                    </span>
                    <span className="text-xs text-[#8F98A3] truncate max-w-[180px]">
                      {viewingNote.courses?.name}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                    {viewingNote.title}
                  </h2>
                </div>

                <button
                  onClick={() => setViewingNote(null)}
                  className="text-[#8F98A3] hover:text-neutral-600 p-1.5 rounded-lg cursor-pointer hover:bg-neutral-200/60 transition"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {viewingNote.content}
                </p>
              </div>

              {/* Fixed Footer */}
              <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#8F98A3]">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>
                    Created {new Date(viewingNote.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const noteToEdit = viewingNote;
                      setViewingNote(null);
                      openEditModal(noteToEdit);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium text-[#3399FF] bg-[#EEF2FF] cursor-pointer hover:bg-[#3399FF]/10 transition"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewingNote(null)}
                    className="px-3.5 py-1.5 rounded-[8px] text-xs font-medium text-neutral-600 bg-neutral-100 cursor-pointer hover:bg-neutral-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          <div className="relative bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {activeNote ? 'Edit Class Note' : 'Create New Class Note'}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#8F98A3] cursor-pointer hover:text-neutral-600 p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real Analysis - Limits and Continuity"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Associated Course
                </label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-[8px] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                >
                  <option value="" disabled>-- Select a Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.course_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Content / Lecture Summary
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write down class summaries, formulas, or key insights..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-[8px] text-xs font-medium text-neutral-600 bg-neutral-100 cursor-pointer hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] text-xs font-medium text-white bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] cursor-pointer hover:opacity-90 transition shadow-md"
                >
                  {activeNote ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;