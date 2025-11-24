import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the fetch API
global.fetch = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => 'Invalid credentials',
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('navigates to dashboard on successful login', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'jwtToken',
      }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Check if token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('jwtToken');
  });
});