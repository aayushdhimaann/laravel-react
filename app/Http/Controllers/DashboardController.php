<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $Student;

    public function __construct()
    {
        $this->Student = new Student();
    }

    public function index()
    {
        // Fetch all students
        $students = $this->Student->orderBy('id', 'desc')->paginate(10);
        return Inertia::render('Dashboard', [
            'students' => $students,
            'flash' => session('success') ? ['success' => session('success')] : null,
        ]);
    }

    public function addStudent(Request $request)
    {
        if ($request->isMethod('get')) {
            // Return the form to add a new student
            return Inertia::render('Student/AddStudent');
        } else if ($request->isMethod('post')) {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'course' => 'required|string|max:255',
                'contact' => 'required|string|max:15', // Adjust as necessary
            ]);

            // Create a new student record in the database

            if ($request->input('id')) {
                $student = Student::findOrFail($request->input('id'));
                $student->name = $validatedData['name'];
                $student->course = $validatedData['course'];
                $student->contact = $validatedData['contact'];
                $student->save();
                $message = 'Student updated successfully!';
            } else {
                $this->Student->name = $validatedData['name'];
                $this->Student->course = $validatedData['course'];
                $this->Student->contact = $validatedData['contact'];
                $this->Student->save();
                $message = 'Student added successfully!';
            }
            return redirect()->route('dashboard')->with('success', $message);
        }
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $student = $this->Student->findOrFail($id);
        $student->delete();
        return redirect()->route('dashboard')->with('success', 'Student deleted successfully!');
    }
}
