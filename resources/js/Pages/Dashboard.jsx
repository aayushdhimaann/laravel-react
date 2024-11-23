import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function Dashboard({ students, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        course: "",
        contact: "",
    });

    // Open modal and reset form with selected student data
    const openModal = (student, id) => {
        setData({
            name: student.name,
            course: student.course,
            contact: student.contact,
        });
        setStudentId(id); // Set studentId for editing
        setIsModalOpen(true); // Open modal
    };

    // Close modal and clear form data
    const closeModal = (e) => {
        e.stopPropagation(); // Prevent modal close when clicking inside the form
        setIsModalOpen(false);
        reset(); // Reset form when closing modal to clear data
        setStudentId(null);
    };

    // update handler
    const submit = (e) => {
        e.preventDefault();

        const validationErrors = {};

        if (!data.name.trim()) {
            validationErrors.name = "Name is required.";
        }

        if (!data.course.trim()) {
            validationErrors.course = "Course is required.";
        }

        if (!data.contact.trim()) {
            validationErrors.contact = "Contact is required.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
            return; // Prevent form submission if there are validation errors
        }

        router.post(
            route("student"),
            {
                ...data,
                id: studentId,
            },
            {
                onSuccess: () => {
                    reset();
                    setStudentId(null);
                    setIsModalOpen(false);
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                },
            }
        );
    };

    // delete handler
    const deleteStudent = (studId) => {
        if (confirm("Are you sure want to delete?")) {
            router.delete(route("student.destroy", { id: studId }));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-6">
                {flash && flash?.success && (
                    <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg p-4">
                        {flash.success}
                    </div>
                )}

                <div className="flex justify-end mb-4">
                    <Link
                        href={route("student")}
                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white hover:underline"
                    >
                        Add Student
                    </Link>
                </div>

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        S. no
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800">
                                {students.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-gray-600 dark:text-gray-300"
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    students.data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {student.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {student.course}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    title="Edit"
                                                    className="text-white shadow-md hover:shadow-lg focus:outline-none"
                                                    onClick={() =>
                                                        openModal(
                                                            student,
                                                            student.id
                                                        )
                                                    }
                                                >
                                                    <span className="material-icons">
                                                        edit
                                                    </span>
                                                </button>
                                                <button
                                                    title="Delete"
                                                    className="text-white shadow-md hover:shadow-lg focus:outline-none ml-2"
                                                    onClick={() => {
                                                        deleteStudent(
                                                            student.id
                                                        );
                                                    }}
                                                >
                                                    <span className="material-icons">
                                                        delete
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-center">
                        {students.links.map((link, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 mx-1 rounded ${
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url); // Use `router.get` for Inertia navigation
                                    }
                                }}
                                disabled={!link.url} // Disable button if URL is null
                                dangerouslySetInnerHTML={{ __html: link.label }} // Render raw HTML for labels like "Previous" or "Next"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for editing student */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-96"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the modal
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Student
                        </h2>
                        <form onSubmit={submit} className="mt-6">
                            {/* Name Input */}
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Course Input */}
                            <div className="mt-4">
                                <InputLabel htmlFor="course" value="Course" />
                                <TextInput
                                    id="course"
                                    type="text"
                                    name="course"
                                    value={data.course}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    autoComplete="course"
                                    onChange={(e) =>
                                        setData("course", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.course}
                                    className="mt-2"
                                />
                            </div>

                            {/* Contact Input */}
                            <div className="mt-4">
                                <InputLabel htmlFor="contact" value="Contact" />
                                <TextInput
                                    id="contact"
                                    type="text"
                                    name="contact"
                                    value={data.contact}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    autoComplete="contact"
                                    onChange={(e) =>
                                        setData("contact", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.contact}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit and Clear Buttons */}
                            <div className="mt-6 flex items-center justify-end">
                                <PrimaryButton
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mr-2"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Updating..."
                                        : "Update Student"}
                                </PrimaryButton>
                                <PrimaryButton
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                    onClick={closeModal}
                                >
                                    Close
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
