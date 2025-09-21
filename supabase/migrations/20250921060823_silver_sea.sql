/*
  # Create hospital management system schema

  1. New Tables
    - `profiles` - User profiles with basic information
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `age` (int)
      - `gender` (text)
      - `phone` (text)
      - `adhar_number` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `doctors` - Doctor information
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `qualification` (text)
      - `department` (text)
      - `contact` (text)
      - `created_at` (timestamp)
    
    - `patients` - Patient records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `problem` (text)
      - `assigned_doctor` (uuid, references doctors)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own profiles
    - Add policy for users to insert their own profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  age int,
  gender text,
  phone text,
  adhar_number text,
  role text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  qualification text,
  department text,
  contact text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  problem text,
  assigned_doctor uuid REFERENCES doctors(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow logged-in read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow logged-in insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);