"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/usdt-staking");
  }, [router]);

  return null;
}
