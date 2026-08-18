"use client";

import React, { useState } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  Trash2Icon, 
  PencilIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  XIcon 
} from 'lucide-react';

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
  course_name: string;
  course_code: string;
  created_at: string;
}

// Dummy Courses for filter and selection
const DUMMY_COURSES: CourseOption[] = [
  { id: '1', name: 'Complex Analysis I', course_code: 'MAT 331' },
  { id: '2', name: 'Real Analysis II', course_code: 'MAT 311' },
  { id: '3', name: 'Ordinary Differential Equations', course_code: 'MAT 341' },
];

// Dummy Notes
const DUMMY_NOTES: NoteItem[] = [
  {
    id: 'n1',
    title: 'Cauchy-Riemann Equations & Differentiability',
    content: 'Analyzed necessary and sufficient conditions for complex differentiability. If f(z) = u(x,y) + i v(x,y), then u_x = v_y and u_y = -v_x must hold continuously.',
    course_id: '1',
    course_name: 'Complex Analysis I',
    course_code: 'MAT 331',
    created_at: '2026-08-14T10:30:00Z',
  },
  {
    id: 'n2',
    title: 'Metric Spaces & Open Ball Topology',
    content: 'Notes on metric space properties. Every open ball B_r(x_0) is open. Covered proofs regarding open sets, closed sets, and continuous mappings between metric spaces.',
    course_id: '2',
    course_name: 'Real Analysis II',
    course_code: 'MAT 311',
    created_at: '2026-08-12T14:15:00Z',
  },
  {
    id: 'n3',
    title: 'Second Order Linear ODEs with Constant Coefficients',
    content: 'Methods for solving homogenous second order linear equations using characteristic equations. Handled real distinct roots, repeated roots, and complex conjugate pairs.',
    course_id: '3',
    course_name: 'Ordinary Differential Equations',
    course_code: 'MAT 341',
    created_at: '2026-08-10T09:00:00Z',
  },
];

const NotesPage = () => {
  const [notes] = useState<NoteItem[]>(DUMMY_NOTES);
  const [courses] = useState<CourseOption[]>(DUMMY_COURSES);
  
  // Interactive UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);

  // Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Filter notes locally for static preview
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = 
      selectedCourseFilter === 'ALL' || note.course_id === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const handleOpenCreateModal = () => {
    setActiveNote(null);
    setNoteTitle('');
    setSelectedCourseId('');
    setNoteContent('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setSelectedCourseId(note.course_id);
    setNoteContent(note.content);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-neutral-900">
            Notes
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Capture, organize, and review your lecture notes and course summaries.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white px-4 py-2.5 rounded-[8px] text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity ease-in-out shadow-[0px_7px_9.1px_0px_#C9C9FF9F]"
        >
          <PlusIcon className="w-4 h-4" />
          Create Note
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mt-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
            Filter by Course:
          </label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="w-full md:w-56 py-2 bg-white border border-neutral-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
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

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 mt-4 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl text-center">
          <BookOpenIcon className="w-12 h-12 text-neutral-300 mb-3" />
          <h3 className="text-lg font-semibold text-neutral-700">No notes found</h3>
          <p className="text-sm text-neutral-400 max-w-sm mt-1">
            Try adjusting your search criteria or create a new note for your classes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group bg-white border border-neutral-200 hover:border-[#3399FF]/50 rounded-[8px] mt-4 mb-4 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div>
                {/* Card Header & Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EEF2FF] text-[#3399FF]">
                    <BookOpenIcon className="w-3 h-3" />
                    {note.course_code}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-1.5 text-neutral-400 hover:text-[#3399FF] rounded-lg transition"
                      title="Edit Note"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition"
                      title="Delete Note"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note Title & Preview */}
                <h3 className="font-semibold text-base text-neutral-900 line-clamp-1 mb-2">
                  {note.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-4 leading-relaxed mb-4">
                  {note.content}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span className="truncate max-w-[180px]">{note.course_name}</span>
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

      {/* Modal: Create / Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          <div className="relative bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {activeNote ? 'Edit Class Note' : 'Create New Class Note'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                  className="w-full p-2.5 border border-neutral-300 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] text-xs font-medium text-white bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] hover:opacity-90 transition shadow-md"
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