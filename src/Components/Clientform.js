import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Clientform() {
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  console.log(clients);

  const { currentUser, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    packageName: "",
    packageDuration: 0,
  });

  const packageOptions = {
    Premium: 90,
    Classic: 60,
    Local: 30,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData);

    // If user selects a package, also set the duration
    if (name === "packageName") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        packageDuration: packageOptions[value] || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";

    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      errs.phone = "Phone must be 10 digits";

    if (!formData.packageName) errs.packageName = "Package is required";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = {
        ...formData,
        addedBy: currentUser?.email, // ✅ Add logged-in user's email
      };

      const response = await axios.post(
        "https://client-management-server.onrender.com/addclient",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Success:", response.data);
      alert("User added successfully!");
      // Optionally reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        packageName: "",
        packageDuration: 0,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Submission failed.");
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      // try {
      //   const res = await axios.get(
      //     "https://client-management-server.onrender.com/getclients",
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`, // ✅ Send JWT in headers
      //       },
      //     }
      //   );
      //   setClients(res.data.clients);

      try {
        let url = "";

        if (selectedTab === "all") {
          url = "https://client-management-server.onrender.com/getclients";
        } else if (selectedTab === "active") {
          url =
            "https://client-management-server.onrender.com/clients/status/active";
        } else if (selectedTab === "inactive") {
          url =
            "https://client-management-server.onrender.com/clients/status/inactive";
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", res);

        setClients(res.data.clients || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    fetchClients();
  }, [token, formData, selectedTab]);
  return (
    <>
      <div className="infoWrapper">
        <div className="formContainer">
          <form className="Form" onSubmit={handleSubmit}>
            <div className="formDiv">
              <h2>ADD USER</h2>
            </div>

            <div className="formDiv">
              <label>Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="formDiv">
              <label>Phone</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="formDiv">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="formDiv">
              <label>Package</label>
              <select
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                required
              >
                <option value="">Select a package</option>
                <option value="Premium">Premium ($1500, 3 months)</option>
                <option value="Classic">Classic ($1000, 2 months)</option>
                <option value="Local">Local ($700, 1 month)</option>
              </select>
              {errors.packageName && (
                <p className="text-red-500 text-sm">{errors.packageName}</p>
              )}
            </div>

            <div className="buttDiv">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
        <div className="displayContainer">
          <div className="displayWrapper">
            <div
              className="tabContainer"
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <button
                className={selectedTab === "all" ? "activeTab" : ""}
                onClick={() => setSelectedTab("all")}
              >
                All Users
              </button>
              <button
                className={selectedTab === "active" ? "activeTab" : ""}
                onClick={() => setSelectedTab("active")}
              >
                Active Users
              </button>
              <button
                className={selectedTab === "inactive" ? "activeTab" : ""}
                onClick={() => setSelectedTab("inactive")}
              >
                Inactive Users
              </button>
            </div>
            <div className="displayBox">
              {clients.length === 0 ? (
                <p>No clients found.</p>
              ) : (
                <div
                  className="displayBox2"
                  style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                >
                  {clients.map((client) => (
                    <div className="individualBox" key={client._id}>
                      <div className="detailsFlex">
                        <div className="details1">
                          <div className="nameHead">
                            <h3>{client.name}</h3>

                            <div
                              className={
                                client.packageStatus.isActive === true
                                  ? "green"
                                  : "red"
                              }
                            ></div>
                          </div>
                          <p>
                            <strong>Email:</strong> {client.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {client.phone}
                          </p>
                          <p>
                            <strong>Package:</strong> {client.packageName}
                          </p>

                          <p>
                            <strong>Admission Date:</strong>
                            {client.createdAt}
                          </p>
                          <p>
                            <strong>Expiry Date:</strong>
                            {client.packageStatus.expiryDate}
                          </p>
                        </div>
                        <div className="details2">
                          <p>
                            <strong>Days Remaining:</strong>
                            {client.packageStatus.daysRemaining}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Clientform;
