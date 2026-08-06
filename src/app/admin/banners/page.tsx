"use client";
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '@/store/bannersSlice';

interface FormState {
    id?: number
    imageFile: File | null
}

const initialForm: FormState = { imageFile: null }

export default function AdminBannersPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((s) => s.banners);
    const [form, setForm] = useState<FormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    const isEdit = useMemo(() => typeof form.id === 'number', [form.id]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, imageFile: file }));
    };

    const resetForm = () => setForm(initialForm);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData();
            if (form.id != null) fd.append('id', String(form.id));
            if (form.imageFile) fd.append('image', form.imageFile);

            if (isEdit) {
                const res = await dispatch(updateBanner(fd)).unwrap();
                if (res) resetForm();
            } else {
                const res = await dispatch(createBanner(fd)).unwrap();
                if (res) resetForm();
            }
        } catch (err) {
            // Errors handled in slice; could show toast here
        } finally {
            setSubmitting(false);
        }
    };

    const onEdit = (id: number) => {
        const b = items.find((x) => x.id === id);
        if (!b) return;
        setForm({
            id: b.id,
            imageFile: null,
        });
    };

    const onDelete = async (id: number) => {
        try {
            await dispatch(deleteBanner({ id })).unwrap();
        } catch {
            // handle error optionally
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Banners</h1>

            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 bg-white/5 p-4 rounded">
                <div>
                    <label className="block text-sm mb-1">Image</label>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                        disabled={submitting || !form.imageFile}
                    >{isEdit ? 'Update Banner' : 'Create Banner'}</button>
                    {isEdit && (
                        <button type="button" className="px-4 py-2 rounded bg-gray-600 text-white" onClick={resetForm}>Cancel</button>
                    )}
                </div>
            </form>

            <div className="flex items-center gap-3">
                {loading && <span className="text-sm">Loading...</span>}
                {error && <span className="text-sm text-red-500">{error}</span>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {items.length > 0 && items.map((b) => (
                    <div key={b.id} className="border rounded overflow-hidden">
                        <div className="aspect-video bg-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.image_path} alt={b.title || String(b.id)} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 space-y-2">
                            <div className="text-sm font-medium">{b.title || 'Untitled'}</div>
                            {b.link_url && <a href={b.link_url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm">{b.link_url}</a>}
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded bg-yellow-600 text-white" onClick={() => onEdit(b.id)}>Edit</button>
                                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(b.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-sm text-gray-400">No banners found.</div>
                )}
            </div>
        </div>
    );
}
