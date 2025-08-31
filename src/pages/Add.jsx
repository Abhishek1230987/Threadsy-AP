import React, { useState } from "react";
import upload_area from "../assets/upload_area.png";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");

  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestSeller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        backendUrl + "/api/products/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product added successfully:", response.data);
      if (response.data.success) {
        // Reset form on success
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubcategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        alert("Product added successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Token being used:", localStorage.getItem("token"));

      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        alert("Access forbidden. Admin permissions required.");
      } else {
        alert(
          "Error adding product: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3 p-6"
    >
      <div>
        <p className="mb-2 text-xl">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-22"
              src={image1 ? URL.createObjectURL(image1) : upload_area}
              alt=""
            />
            <p className="text-sm px-2.5">Thumbnail</p>
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={image2 ? URL.createObjectURL(image2) : upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={image3 ? URL.createObjectURL(image3) : upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={image4 ? URL.createObjectURL(image4) : upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 mt-3">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w[500px] px-3 py-1"
          type="text"
          placeholder="type here..."
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w[500px] px-3 py-1"
          placeholder="write description here..."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="max-w-full px-3 py-1"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Gadgets">Gadgets</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Subcategory</p>
          <select
            className="max-w-full px-3 py-1"
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="traditionals">Traditionals</option>
            <option value="Gown">Gown</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Summarwear">Summarwear</option>
            <option value="Gadgets">Gadgets</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product pricing</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="max-w-full px-3 py-1"
            type="number"
            placeholder="pricing..."
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`border rounded py-1 px-3 cursor-pointer ${
                  sizes.includes(size) ? "border-darkoffwhite" : "bg-offwhite"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default Add;
