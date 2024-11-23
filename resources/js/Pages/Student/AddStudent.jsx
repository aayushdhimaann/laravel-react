import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function AddStudent() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        course: "",
        contact: "",
    });

    // State to manage validation errors
    const [validationErrors, setValidationErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = {};

        if (!data.name.trim()) {
            errors.name = "Name is required.";
        }

        if (!data.course.trim()) {
            errors.course = "Course is required.";
        }
        if (!data.contact.trim()) {
            errors.contact = "Contact is required.";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return; // Prevent form submission if there are validation errors
        }

        // Post the form data to the server if no errors
        post(route("student"), {
            onFinish: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Student" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Add New Student
                            </h1>

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

                                    {/* Display name error message */}
                                    {validationErrors.name && (
                                        <InputError
                                            message={validationErrors.name}
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                {/* Course Input */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="course"
                                        value="Course"
                                    />

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

                                    {/* Display course error message */}
                                    {validationErrors.course && (
                                        <InputError
                                            message={validationErrors.course}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="contact"
                                        value="Contact"
                                    />

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

                                    {/* Display course error message */}
                                    {validationErrors.contact && (
                                        <InputError
                                            message={validationErrors.contact}
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6 flex items-center justify-end">
                                    <PrimaryButton
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Adding..."
                                            : "Add Student"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
