import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TrainingSide from "../Components/TrainingSide";
import ViewTrainings from "../Components/ViewTrainings";
import instance from "../api"; // Ensure this import points to a configured Axios instance
import { useSelector } from "react-redux";
import AttendancePredictor from "./AttendancePredictor";

// Validation Schema using Yup
const validationSchema = Yup.object({
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date cannot be in the past"),
  time: Yup.string().required("Time is required"),
  location: Yup.string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters long"),
  vehicleID: Yup.string().required("Vehicle ID is required"),
  maxCount: Yup.number()
    .required("Maximum number of participants is required")
    .min(1, "At least one participant is required")
    .max(100, "Cannot exceed 100 participants")
    .positive("Number of participants cannot be negative"),
  instructorQualification: Yup.string().required(
    "Instructor Qualification is required"
  ),
});

const PhysicalTrainingHome = () => {
  const [vehicles, setVehicles] = useState([]);
  const [update, setUpdate] = useState(false);
  const [insID , setInsID] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    console.log("Current User:", currentUser); // This will show you what's available in currentUser
    if (currentUser && currentUser.InstructorID) {
      setInsID(currentUser.InstructorID);
      console.log(insID)
    }
  }, [currentUser]);  //
  // Fetch vehicles data from the backend
  // const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser.InstructorID);
  // const instructorID = currentUser.instructorID;
  
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await instance.get("/vehicle"); // Ensure correct endpoint
        setVehicles(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicleData();
  }, [vehicles]);

  const formik = useFormik({
    initialValues: {
      date: "",
      time: "",
      location: "",
      vehicleID: "",
      maxCount: "",
      instructorQualification: "",
    },
    validationSchema,

    onSubmit: (values) => {
      const dataSend = {
        instructorID: insID,
        date: values.date,
        time: values.time,
        location: values.location,
        vehicleID: values.vehicleID,
        maxCount: values.maxCount,
        instructorQualification: values.instructorQualification,
      }
      try {
        const data = instance.post("/pts/add", dataSend).then((response) => {
          alert("Training session scheduled successfully");
          setUpdate(!update);
          // Add navigation or state update logic here if needed
        });
        if (!data) {
          throw new Error("Failed to schedule training session");
        }
      } catch (error) {
        console.error("Error scheduling training session:", error);
        alert("Error scheduling training session");
      }
    },
  });

  return (
    <div className="w-full flex flex-row">
      <TrainingSide />
      <div className="mx-2">
        <div className="bg-gray-100 p-4 mt-6">
          <h1 className="font-bold text-gray-800 text-center text-3xl">
            Welcome to Training Sessions
          </h1>
          <div className="flex flex-row">
            <div className="mx-20 w-72 ">
              <h1 className="text-xl font-bold m-4">Add a Training Session</h1>
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-6 mx-auto"
              >
                {/* Instructor ID Input */}
                {/* <label htmlFor="instructorID">Instructor ID</label> */}
                {/* <input
                  id="instructorID"
                  name="instructorID"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.instructorID}
                  className="border p-1 rounded w-full"
                  style={{ display: "none" }} // This hides the input field
                />

                {formik.touched.instructorID && formik.errors.instructorID ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.instructorID}
                  </div>
                ) : null} */}

                {/* Date Input */}
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  onChange={formik.handleChange}
                  value={formik.values.date}
                  className="border p-1 rounded w-full"
                />
                {formik.touched.date && formik.errors.date ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.date}
                  </div>
                ) : null}

                {/* Time Input */}
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  onChange={formik.handleChange}
                  value={formik.values.time}
                  className="border p-1 rounded w-full"
                />
                {formik.touched.time && formik.errors.time ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.time}
                  </div>
                ) : null}

                {/* Location Input */}
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.location}
                  className="border p-1 rounded w-full"
                />
                {formik.touched.location && formik.errors.location ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.location}
                  </div>
                ) : null}

                {/* Vehicle ID Dropdown */}
                <label htmlFor="vehicleID">Vehicle ID</label>
                <select
                  id="vehicleID"
                  name="vehicleID"
                  onChange={formik.handleChange}
                  value={formik.values.vehicleID}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select a Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle.vehicleNO}>
                      {vehicle.vehicleNO}
                    </option>
                  ))}
                </select>
                {formik.touched.vehicleID && formik.errors.vehicleID ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.vehicleID}
                  </div>
                ) : null}

                {/* Max Participants Input */}
                <label htmlFor="maxCount">Max Participants</label>
                <input
                  id="maxCount"
                  name="maxCount"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.maxCount}
                  className="border p-1 rounded w-full"
                  min="1"
                />
                {formik.touched.maxCount && formik.errors.maxCount ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.maxCount}
                  </div>
                ) : null}

                {/* Max Participants Input */}
                <label htmlFor="instructorQualification">
                  Instructor Qualification
                </label>
                <input
                  id="instructorQualification"
                  name="instructorQualification"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.instructorQualification}
                  className="border p-1 rounded w-full"
                />
                {formik.touched.instructorQualification &&
                formik.errors.instructorQualification ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.instructorQualification}
                  </div>
                ) : null}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={formik.isSubmitting}
                >
                  Schedule Session
                </button>
              </form>
            </div>
            <div className="flex flex-row mx-auto ">
                <div className="mx-10">
                <ViewTrainings update={update} />
                </div>
                <div className="mx-10">
              <AttendancePredictor/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalTrainingHome;
