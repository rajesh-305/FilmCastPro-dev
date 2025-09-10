import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { supabase } from "../lib/supabaseClient";

type Experience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

type Education = {
  institute: string;
  course: string;
  duration: string;
  description: string;
};



type ProfileData = {
  name: string;
  role: string;
  location: string;
  bio: string;
  coverPhoto: string;
  profilePhoto: string;
  experience: Experience[];
  skills: [];
  education: Education[];
  plan: string;
};

interface ProfileProps {
  onPageChange: (page: string) => void;
}

export const UserProfile: React.FC<ProfileProps> = ({ onPageChange }) => {
  const [ProfileData, setProfileData] = useState<ProfileData>({
    name: "",
    role: "",
    location: "",
    bio: "",
    coverPhoto: "",
    profilePhoto: "",
    experience: [],
    skills: [],
    education: [],
    plan: "",
  });
  const [UpdateProfileData, setUpdateProfileData] = useState<ProfileData>({
    name: "",
    role: "",
    location: "",
    bio: "",
    coverPhoto: "",
    profilePhoto: "",
    experience: [],
    skills: [],
    education: [],
    plan: "",
  });

  const [modal, setModal] = useState(false);



  const fetchData = async () => {
    let loginId = localStorage.getItem("user_id");
    console.log(loginId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", loginId);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setProfileData(data[0]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const updateData = async (e: React.FormEvent) => {
  e.preventDefault();

  let loginId = localStorage.getItem("user_id");
  if (!loginId) return console.log("User not logged in!");

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...UpdateProfileData })
    .eq("user_id", loginId).single();

  if (error) {
    console.log("Supabase error:", error);
  } else {
    console.log("Updated data:", data);
    setProfileData(UpdateProfileData);
    setModal(false);
  }


};
const DeleteExpericence = (index: number) => {
  const updatedExperience = [...UpdateProfileData.experience];
  updatedExperience.splice(index, 1);
  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperience
  });
};

const DeleteEducation = (index:number)=>{
    const updateEducation = [...UpdateProfileData.education];
    updateEducation.splice(index,1);
    setUpdateProfileData({...UpdateProfileData,education:updateEducation})
}

const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);

const [editingIndex, setEditingIndex] = useState<number | null>(null);

const startEdit = (index: number) => {
  setEditingIndex(index);
};

const saveEdit = (index: number, updatedData: any) => {
  const updatedExperiences = [...UpdateProfileData.experience];
  updatedExperiences[index] = updatedData;

  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperiences,
  });

  setEditingIndex(null); 
};
const startEditEdu = (index: number) => {
  setEditingEduIndex(index);
};

const saveEditEdu = (index: number, updatedData: Education) => {
  const updatedEducation = [...UpdateProfileData.education];
  updatedEducation[index] = updatedData;

  setUpdateProfileData({
    ...UpdateProfileData,
    education: updatedEducation,
  });

  setEditingEduIndex(null); 
};
const [newExperience, setNewExperience] = useState<Experience>({
  company: "",
  role: "",
  duration: "",
  description: "",
});

const [newEducation, setNewEducation] = useState<Education>({
  institute: "",
  course: "",
  duration: "",
  description: "",
});
const [isAddingExperience, setIsAddingExperience] = useState(false);
const [isAddingEducation,setisAddingEducation] = useState(false);

const addnewExpEdu = (type: string) => {
  if (type === "Experience") {
    setIsAddingExperience(true);
  } else if (type === "Education") {
    setisAddingEducation(true);
  }
};
const saveNewExperience = () => {
  const updatedExperience = [...UpdateProfileData.experience, newExperience];
  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperience,
  });
  setIsAddingExperience(false);
  setNewExperience({ company: "", role: "", duration: "", description: "" });
};
const saveNewEducation = () => {
  const updatedEducation = [...UpdateProfileData.education, newEducation];
  setUpdateProfileData({
    ...UpdateProfileData,
    education: updatedEducation,
  });
  setisAddingEducation(false);
  setNewEducation({ institute: "", course: "", duration: "", description: "" });
};






return (
    <>
      <div className="bg-gray-900 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-5xl bg-gray-900 px-4 md:px-8">
          
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            
          <div className="h-48 w-full">
            <img
              src={ProfileData.coverPhoto || "https://images.unsplash.com/photo-1503264116251-35a269479413"} 
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end p-6">
              
            <div className="absolute -top-16 md:-top-20 left-1/2 md:left-10 transform -translate-x-1/2 md:translate-x-0 profile">
              <img
                src={ProfileData.profilePhoto || "https://tse3.mm.bing.net/th/id/OIP.apRNXJkvlf4bc55gw0dXLQHaHa?pid=Api&P=0&h=180"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
            </div>

            <div className="mt-20 md:mt-0 md:ml-40 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">
                {ProfileData.name || "Abhishek Name"}
              </h1>
              <p className="text-gray-300 text-lg">
                {ProfileData.role || "Director"}
              </p>
              <p className="text-gray-400">
                {ProfileData.location || "Hyderabad"}
              </p>
            </div>

            <div className="ml-auto mt-4 md:mt-0">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                onClick={() => {
                  setUpdateProfileData(JSON.parse(JSON.stringify(ProfileData)));
                  setModal(true);
                }}

                >Edit Profile
              </button>
            </div>
          </div>
        </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-900 text-xl font-semibold mb-3">About</h3>
            <p className="text-gray-700 text-base">
              {ProfileData.bio || "Nothing great added yet."}
            </p>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-900 text-xl font-semibold mb-3">
              Experience
            </h3>
            {ProfileData.experience && ProfileData.experience.length > 0 ? (
              ProfileData.experience.map((exp, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-lg font-medium text-gray-800">
                    {exp.role}
                  </h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-500 text-sm">{exp.duration}</p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">
                No experience added yet. Add experience to enhance your profile.
              </p>
            )}
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-900 text-xl font-semibold mb-3">
              Education
            </h3>
            {ProfileData.education && ProfileData.education.length > 0 ? (
              ProfileData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <h5 className="text-lg font-medium text-gray-800">
                    {edu.course}
                  </h5>

                  <p className="text-gray-700">{edu.institute}</p>

                  <small className="text-gray-500 block mb-2">
                    {edu.duration}
                  </small>

                
                  {edu.description && (
                    <p className="mt-2 text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-700">
                No education added yet. Add education to enhance your profile.
              </p>
            )}
          </div>
      </div>



<div className="mt-6 bg-white p-6 rounded-lg shadow-lg skills">
  <h3 className="text-gray-900 text-xl font-semibold mb-3">Skills</h3>
  {ProfileData.skills.length > 0 ? (
    <div className="flex flex-wrap gap-3">
      {ProfileData.skills.map((skill, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-200 transition"
        >
          {skill}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-gray-700">
      No skills added yet. Add skills to enhance your profile.
    </p>
  )}
</div>



      </div>

      {modal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setModal(false)}
                ></button>
              </div>

<div className="modal-body">

  <div className="mb-3">
    <label htmlFor="name" className="form-label text-dark">
      Name
    </label>
    <input
      type="text"
      className="form-control"
      value={UpdateProfileData.name}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          name: e.target.value,
        })
      }
    />
  </div>

  {/* Role */}
  <div className="mb-3">
    <label htmlFor="role" className="form-label text-dark">
      Role
    </label>
    <input
      type="text"
      className="form-control"
      value={UpdateProfileData.role}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          role: e.target.value,
        })
      }
    />
  </div>


  <div className="mb-3">
    <label htmlFor="location" className="form-label text-dark">
      Location
    </label>
    <input
      type="text"
      className="form-control"
      value={UpdateProfileData.location}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          location: e.target.value,
        })
      }
    />
  </div>


  <div className="mb-3">
    <label htmlFor="bio" className="form-label text-dark">
      Bio
    </label>
    <input
      className="form-control"
      value={UpdateProfileData.bio}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          bio: e.target.value,
        })
      }
    />
  </div>


<div className="mb-4">
  <label className="form-label text-dark h5 fw-bold">Experience Details</label>

  <div className="row">
    {UpdateProfileData.experience.map((exp, index) => (
      <div key={index} className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          {editingIndex === index ? (
            // ===== EDIT MODE =====
            <div>
              <div className="mb-2">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={exp.role}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.experience];
                    updated[index].role = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      experience: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.experience];
                    updated[index].company = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      experience: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  value={exp.duration}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.experience];
                    updated[index].duration = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      experience: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.experience];
                    updated[index].description = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      experience: updated,
                    });
                  }}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => saveEdit(index, exp)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // ===== VIEW MODE =====
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="card-title mb-0 text-dark fw-bold">
                    {exp.role}
                  </h5>
                  <small className="text-muted">{exp.company}</small>
                </div>

                <span
                  className="badge text-secondary px-3 py-2"
                  style={{ fontStyle: "italic" }}
                >
                  {exp.duration}
                </span>
              </div>

              {exp.description && (
                <p className="card-text mt-2 text-muted">{exp.description}</p>
              )}

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => startEdit(index)}
                >
                  <i className="fa-solid fa-pen text-secondary"></i>
                </button>
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => DeleteExpericence(index)}
                >
                  <i className="fa-solid fa-trash text-secondary"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}

    {/* ADD NEW EXPERIENCE FORM */}
    {isAddingExperience && (
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          <div className="mb-2">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.role}
              onChange={(e) =>
                setNewExperience({ ...newExperience, role: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.duration}
              onChange={(e) =>
                setNewExperience({ ...newExperience, duration: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-success" onClick={saveNewExperience}>
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setIsAddingExperience(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* ADD BUTTON */}
  {!isAddingExperience && (
    <button
      className="btn mt-1"
      onClick={() => addnewExpEdu("Experience")}
    >
      <i className="fa-solid fa-circle-plus"></i> Add Experience
    </button>
  )}
</div>



<div className="mb-2">
  <label className="form-label text-dark h5 fw-bold">Education Details</label>

  <div className="row">
    {UpdateProfileData.education.map((edu, index) => (
      <div key={index} className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          {editingEduIndex === index ? (
            <div>
              <div className="mb-2">
                <label className="form-label">Institute</label>
                <input
                  type="text"
                  className="form-control"
                  value={edu.institute}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.education];
                    updated[index].institute = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      education: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Course</label>
                <input
                  type="text"
                  className="form-control"
                  value={edu.course}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.education];
                    updated[index].course = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      education: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  value={edu.duration}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.education];
                    updated[index].duration = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      education: updated,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={edu.description}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.education];
                    updated[index].description = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      education: updated,
                    });
                  }}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => saveEditEdu(index, edu)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingEduIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="card-title mb-0 text-dark fw-bold">
                    {edu.institute}
                  </h5>
                  <small className="text-muted">{edu.course}</small>
                </div>

                <span
                  className="badge text-secondary px-3 py-2"
                  style={{ fontStyle: "italic" }}
                >
                  {edu.duration}
                </span>
              </div>

              {edu.description && (
                <p className="card-text mt-2 text-muted">{edu.description}</p>
              )}

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => startEditEdu(index)}
                >
                  <i className="fa-solid fa-pen text-secondary"></i>
                </button>
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => DeleteEducation(index)}
                >
                  <i className="fa-solid fa-trash text-secondary"></i>
                </button>
              </div>
            </div>
              {isAddingEducation && (
  <div className="card mb-3 shadow-sm">
    <div className="card-body">
      <div className="mb-2">
        <label className="form-label">Institute</label>
        <input
          type="text"
          className="form-control"
          value={newEducation.institute}
          onChange={(e) =>
            setNewEducation({ ...newEducation, institute: e.target.value })
          }
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Course</label>
        <input
          type="text"
          className="form-control"
          value={newEducation.course}
          onChange={(e) =>
            setNewEducation({ ...newEducation, course: e.target.value })
          }
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Duration</label>
        <input
          type="text"
          className="form-control"
          value={newEducation.duration}
          onChange={(e) =>
            setNewEducation({ ...newEducation, duration: e.target.value })
          }
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={newEducation.description}
          onChange={(e) =>
            setNewEducation({ ...newEducation, description: e.target.value })
          }
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-sm btn-success" onClick={saveNewEducation}>
          Save
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setisAddingEducation(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

            </div>
          )}
        </div>
      </div>
    ))}
  </div>
  <button className="btn mt-n5" onClick={()=>{addnewExpEdu('Education')}}><i className="fa-solid fa-circle-plus"></i> Add Education</button>
</div>
</div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={updateData}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};