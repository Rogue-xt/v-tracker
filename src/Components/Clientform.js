import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function Clientform() {
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);


  // console.log(clients);

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
    // console.log(formData);

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
        "https://client-management-server-ten.vercel.app/addclient",
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
      try {
        let url = "";

        if (selectedTab === "all") {
          url = "https://client-management-server-ten.vercel.app/getclients";
        } else if (selectedTab === "active") {
          url =
            "https://client-management-server-ten.vercel.app/clients/status/active";
        } else if (selectedTab === "inactive") {
          url =
            "https://client-management-server-ten.vercel.app/clients/status/inactive";
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("response", res);

        setClients(res.data.clients || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    fetchClients();
  }, [token, formData, selectedTab]);

  // filtering client
  // const filteredClients = clients.filter((client) => {
  //   const text = searchText.toLowerCase();
  //   return (
  //     client.name.toLowerCase().includes(text) ||
  //     client.email.toLowerCase().includes(text) ||
  //     client.phone.includes(text)
  //   );
  // });



  const filteredClients = Array.isArray(clients)
    ? clients.filter((c) => {
        const text = searchText.toLowerCase();
        return (
          c?.name?.toLowerCase().includes(text) ||
          c?.email?.toLowerCase().includes(text) ||
          c?.phone?.includes(text)
        );
      })
    : [];


  //Delete client

  const handleDelete = async (id) => {
    // console.log("passed id:",id);
    // console.log("token is",token);
    try {
      const response = await axios.delete(
        `https://client-management-server-ten.vercel.app/deleteclient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("delete response:", response.data);
      if (response.data.status === "success") {
        alert("Client deleted successfully");
        setClients((prevClients) =>
          prevClients.filter((client) => client._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      console.log("Error response:", error.response);
      alert("Failed to delete client");
    }
  };

  //Edit client

  const openEditModal = (client) => {
    setEditClientData(client);
    setIsEditModalOpen(true);
    console.log("editmodal open:", isEditModalOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditClientData((prev) => ({ ...prev, [name]: value }));
    // console.log(editClientData);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `https://client-management-server-ten.vercel.app/client/updateclient/${editClientData._id}`,
        editClientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     

      if (response.data.status === "success") {
        alert("Client updated successfully");
         console.log("edit response:", response.data);

        // Update in local state
        setClients((prev) =>
          prev.map((client) =>
            client._id === editClientData._id
              ? response.data.client
              : client
          )
        );


        

        setIsEditModalOpen(false);
        setEditClientData(null);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update client");
    }
  };

  return (
    <>
      <div className="infoWrapper">
        <div className="formContainer">
          {/* <form className="Form" onSubmit={handleSubmit}>
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
          </form> */}
          {isAddUserModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="modal-close"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  &times;
                </button>

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
                      <p className="text-red-500 text-sm">
                        {errors.packageName}
                      </p>
                    )}
                  </div>

                  <div className="buttDiv">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="displayContainer">
          <div className="displayWrapper">
            <div className="tab-wrapper">
              <div className="firstTab">
                <button onClick={() => setIsAddUserModalOpen(true)}>
                  Add Client
                </button>
              </div>
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
                <div className="searchBox">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* <div className="displayBox">
              {filteredClients.length === 0 ? (
                <p>No clients found.</p>
              ) : (
                <div
                  className="displayBox2"
                  style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                >
                  {filteredClients.map((client) => (
                    <div className="individualBox" key={client._id}>
                      <div className="nameHead">
                        <div className="dflex">
                          <h3>{client.name}</h3>
                          <div
                            className={
                              client.packageStatus.isActive === true
                                ? "green"
                                : "red"
                            }
                          ></div>
                        </div>
                        <div className="dflex">
                          <button onClick={() => handleDelete(client._id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                          <button onClick={() => openEditModal(client)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </div>
                      </div>
                      <div className="detailsFlex">
                        <div className="details1">
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
                            <strong>
                              Days Remaining:
                              {client.packageStatus.daysRemaining}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            <div className="clientTableWrapper">
              {filteredClients.length === 0 ? (
                <p>No clients found.</p>
              ) : (
                <table className="clientTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Package</th>
                      <th>Admission Date</th>
                      <th>Expiry Date</th>
                      <th>Days Remaining</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client, index) => (
                      <tr
                        key={client._id}
                        className={index % 2 === 0 ? "rowLight" : "rowDark"}
                      >
                        <td className="clientName">{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.packageName}</td>
                        <td>{client.createdAt}</td>
                        <td>{client.packageStatus.expiryDate}</td>
                        <td>{client.packageStatus.daysRemaining}</td>
                        <td>
                          <span
                            className={
                              client.packageStatus.isActive
                                ? "statusDot green"
                                : "statusDot red"
                            }
                          ></span>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(client._id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                          <button onClick={() => openEditModal(client)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="Mymodal">
          {isEditModalOpen && editClientData && (
            <div
              className="modal"
              style={{ display: isEditModalOpen ? "flex" : "none" }}
            >
              <div className="modal-content">
                <h2>Edit Client</h2>
                <form onSubmit={handleEditSubmit}>
                  <label>name</label>
                  <input
                    type="text"
                    name="name"
                    value={editClientData.name}
                    onChange={handleEditChange}
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editClientData.email}
                    onChange={handleEditChange}
                  />

                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editClientData.phone}
                    onChange={handleEditChange}
                  />

                  <label>Package</label>
                  <select
                    name="packageName"
                    value={editClientData.packageName}
                    onChange={handleEditChange}
                  >
                    <option value="Premium">Premium</option>
                    <option value="Classic">Classic</option>
                    <option value="Local">Local</option>
                  </select>

                  <div className="edit-btn" style={{ marginTop: "10px" }}>
                    <button type="submit">Update</button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Clientform;
