"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteProjectButtonProps = {
  slug: string;
  title: string;
};

export default function DeleteProjectButton({
  slug,
  title,
}: DeleteProjectButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus project "${title}"?\n\nProject, relasi media, dan relasi material project akan dihapus.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/projects/${slug}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Project gagal dihapus."
        );
      }

      router.refresh();
    } catch (error) {
      console.error("Delete project error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Project gagal dihapus."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center justify-center rounded-full border border-red-200 px-5 py-2.5 text-xs font-medium text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Menghapus..." : "Delete"}
    </button>
  );
}