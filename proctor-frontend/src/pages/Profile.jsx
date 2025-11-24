import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    joinDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Computer Science student with a passion for mathematics and problem-solving.',
    courses: [
      { id: 1, name: 'Mathematics 101', instructor: 'Dr. Smith' },
      { id: 2, name: 'Physics 201', instructor: 'Prof. Johnson' },
      { id: 3, name: 'Chemistry 101', instructor: 'Dr. Williams' }
    ],
    stats: {
      examsTaken: 12,
      examsCompleted: 10,
      averageScore: 87.5
    }
  });

  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    // In a real app, you would fetch user data from an API here
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {!editing ? (
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      <div className="flex flex-col items-center">
                        <img className="h-32 w-32 rounded-full object-cover" src={editing ? editedUser.avatar : user.avatar} alt="Profile" />
                        <div className="mt-4 text-center">
                          <h2 className="text-xl font-bold text-gray-900">{editing ? editedUser.name : user.name}</h2>
                          <p className="text-sm text-gray-500">{editing ? editedUser.role : user.role}</p>
                          <p className="text-sm text-gray-500">Member since {editing ? editedUser.joinDate : user.joinDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                          </label>
                          <div className="mt-1">
                            {editing ? (
                              <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={editedUser.bio}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.bio}</p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <div className="mt-1">
                            {editing ? (
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={editedUser.name}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.name}</p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="mt-1">
                            {editing ? (
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={editedUser.email}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Statistics
                          </label>
                          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-5 w-0 flex-1">
                                    <dl>
                                      <dt className="text-sm font-medium text-gray-500 truncate">Exams Taken</dt>
                                      <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{user.stats.examsTaken}</div>
                                      </dd>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div className="ml-5 w-0 flex-1">
                                    <dl>
                                      <dt className="text-sm font-medium text-gray-500 truncate">Exams Completed</dt>
                                      <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{user.stats.examsCompleted}</div>
                                      </dd>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-5 w-0 flex-1">
                                    <dl>
                                      <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                                      <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{user.stats.averageScore}%</div>
                                      </dd>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Enrolled Courses
                          </label>
                          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {user.courses.map((course) => (
                              <div key={course.id} className="bg-gray-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                                  <p className="mt-1 text-sm text-gray-500">Instructor: {course.instructor}</p>
                                  <div className="mt-4">
                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                      View Course
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;