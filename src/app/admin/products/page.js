"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/products" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530]">
            Products
          </h1>
          <Link
            href="/admin/products/add"
            className="bg-[#6B4530] text-white px-6 py-2 rounded-full font-medium hover:bg-[#8B6F5C] transition"
          >
            + Add Product
          </Link>
        </div>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-[#8B6F5C]">No products yet.</p>
        ) : (
          <div className="bg-white rounded-lg border border-[#E5D5C3] overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#F0CBA3] text-[#6B4530]">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-[#E5D5C3]">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0CBA3] flex items-center justify-center">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-[#8B6F5C]">No img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B4530] font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-[#6B4530]">{p.category}</td>
                    <td className="px-4 py-3 text-[#6B4530]">Rs. {p.price}</td>
                    <td className="px-4 py-3 text-[#6B4530]">{p.stock}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <Link
                        href={`/admin/products/edit/${p._id}`}
                        className="text-[#6B4530] underline hover:text-[#8B6F5C]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 underline hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
