import React, { useState } from 'react';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    password: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account settings and preferences.</p>
              </div>
              <div className="border-t border-gray-200">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                  {/* Profile Section */}
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                      <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                          Photo
                        </label>
                        <div className="mt-1 flex items-center">
                          <img className="inline-block h-12 w-12 rounded-full" src={profile.avatar} alt="Profile" />
                          <div className="ml-4 flex">
                            <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <label htmlFor="user-photo" className="relative text-sm font-medium text-gray-900 pointer-events-none">
                                Change
                              </label>
                              <input id="user-photo" name="user-photo" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Section */}
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
                      <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications.</p>
                    </div>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Email
                          </label>
                          <p className="text-sm text-gray-500">Receive notifications via email.</p>
                        </div>
                        <input
                          type="checkbox"
                          name="email"
                          id="email"
                          checked={notifications.email}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="push" className="text-sm font-medium text-gray-900">
                            Push Notifications
                          </label>
                          <p className="text-sm text-gray-500">Receive push notifications on your devices.</p>
                        </div>
                        <input
                          type="checkbox"
                          name="push"
                          id="push"
                          checked={notifications.push}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="sms" className="text-sm font-medium text-gray-900">
                            SMS
                          </label>
                          <p className="text-sm text-gray-500">Receive text messages for important updates.</p>
                        </div>
                        <input
                          type="checkbox"
                          name="sms"
                          id="sms"
                          checked={notifications.sms}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Security</h3>
                      <p className="mt-1 text-sm text-gray-500">Update your security settings.</p>
                    </div>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="two-factor" className="text-sm font-medium text-gray-900">
                            Two-factor Authentication
                          </label>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                        </div>
                        <input
                          type="checkbox"
                          name="twoFactor"
                          id="two-factor"
                          checked={security.twoFactor}
                          onChange={handleSecurityChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={security.password}
                            onChange={handleSecurityChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;