"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
} from "@/store/milestonesSlice";

interface FormState {
    id?: number;
    name: string;
    self_investment_min: string;
    direct_investment_min: string;
    reward: string;
    is_active: boolean;
    sort_order: string;
    imageFile: File | null;
}

const initialForm: FormState = {
    name: "",
    self_investment_min: "",
    direct_investment_min: "",
    reward: "",
    is_active: true,
    sort_order: "",
    imageFile: null,
};

export default function AdminMilestonesPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((s) => s.milestones);
    const [form, setForm] = useState<FormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchMilestones());
    }, [dispatch]);

    const isEdit = useMemo(() => typeof form.id === "number", [form.id]);

    const resetForm = () => {
        setForm(initialForm);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, imageFile: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const fd = new FormData();
            if (form.id != null) fd.append("id", String(form.id));
            fd.append("name", form.name);
            fd.append("self_investment_min", form.self_investment_min);
            fd.append("direct_investment_min", form.direct_investment_min);
            fd.append("reward", form.reward);
            fd.append("is_active", form.is_active ? "1" : "0");
            fd.append("sort_order", form.sort_order);
            if (form.imageFile) fd.append("image", form.imageFile);

            if (isEdit) {
                await dispatch(updateMilestone(fd)).unwrap();
            } else {
                await dispatch(createMilestone(fd)).unwrap();
            }

            resetForm();
        } catch (err) {
            // errors are stored in slice; could show toast here
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (id: number) => {
        const m = items.find((x) => x.id === id);
        if (!m) return;
        setForm({
            id: m.id,
            name: m.name,
            self_investment_min: String(m.self_investment_min ?? ""),
            direct_investment_min: String(m.direct_investment_min ?? ""),
            reward: String(m.reward ?? ""),
            is_active: Boolean(m.is_active),
            sort_order: String(m.sort_order ?? ""),
            imageFile: null,
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this milestone?")) return;
        try {
            await dispatch(deleteMilestone({ id })).unwrap();
        } catch {
            // ignore
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold">Achievement Milestones</h1>
                <button
                    type="button"
                    className={`px-4 py-2 rounded text-white ${isEdit ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
                    onClick={() => (isEdit ? resetForm() : null)}
                >
                    {isEdit ? "Cancel Edit" : "Create New Milestone"}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">{isEdit ? "Edit milestone" : "Create milestone"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Self investment min</label>
                        <input
                            value={form.self_investment_min}
                            onChange={(e) => setForm((prev) => ({ ...prev, self_investment_min: e.target.value }))}
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Direct investment min</label>
                        <input
                            value={form.direct_investment_min}
                            onChange={(e) => setForm((prev) => ({ ...prev, direct_investment_min: e.target.value }))}
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Reward</label>
                        <input
                            value={form.reward}
                            onChange={(e) => setForm((prev) => ({ ...prev, reward: e.target.value }))}
                            type="number"
                            step="any"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort order</label>
                        <input
                            value={form.sort_order}
                            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                            type="number"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-medium">Active</label>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-sm">Is active</span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Image (optional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="md:col-span-2 flex gap-2 mt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : isEdit ? "Update Milestone" : "Create Milestone"}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 rounded bg-gray-600 text-white"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Existing Milestones</h2>
                {loading && <p>Loading...</p>}
                {!loading && items.length === 0 && <p className="text-sm text-gray-500">No milestones found.</p>}
                {!loading && items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 border-b">Name</th>
                                    <th className="py-2 px-3 border-b">Self Min</th>
                                    <th className="py-2 px-3 border-b">Direct Min</th>
                                    <th className="py-2 px-3 border-b">Reward</th>
                                    <th className="py-2 px-3 border-b">Active</th>
                                    <th className="py-2 px-3 border-b">Sort</th>
                                    <th className="py-2 px-3 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-3 border-b">{m.name}</td>
                                        <td className="py-2 px-3 border-b">{m.self_investment_min}</td>
                                        <td className="py-2 px-3 border-b">{m.direct_investment_min}</td>
                                        <td className="py-2 px-3 border-b">{m.reward}</td>
                                        <td className="py-2 px-3 border-b">{m.is_active ? "Yes" : "No"}</td>
                                        <td className="py-2 px-3 border-b">{m.sort_order}</td>
                                        <td className="py-2 px-3 border-b">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(m.id)}
                                                    className="px-3 py-1 rounded bg-yellow-600 text-white text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m.id)}
                                                    className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
