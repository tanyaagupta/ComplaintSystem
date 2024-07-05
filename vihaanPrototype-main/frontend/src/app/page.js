"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwZ-rqDktv_mMlx-Meo3D4xaV1BT7kRQj9cBocdSWAHBxLKtwEH-RgznSo0QSgrAZdfAA/exec";

  const backendURL =
    "https://test-backend-production-4cda.up.railway.app/classify";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formdata = new FormData(e.target);
    console.log(formdata);
    try {
      const complaint = new FormData();
      complaint.append("complaint", formdata.get("complaint"));
      const data = await fetch(backendURL, {
        method: "POST",
        body: complaint,
      }).then((response) => response.json());
      if (!data) data.prediction = "Unknown";
      formdata.append("type", data.prediction);
      console.log(data);
      setResult("Category: " + data.prediction);
      await fetch(scriptURL, {
        method: "POST",
        body: formdata,
      })
        .then((response) => console.log("Success!", response))
        .catch((error) => console.error("Error!", error.message));
    } catch (error) {
      console.error("Error!", error.message);
      setResult(
        "An error occurred while submitting your complaint. Please try again later."
      );
    }
    e.target.reset();
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500">
      <Card className="w-[400px] p-8">
        <h1 className="text-2xl font-bold pb-4">Complaint Form</h1>
        <form onSubmit={(e) => submitForm(e)} className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input type="text" name="name" />
          </div>
          <div>
            <Label>Complaint</Label>
            <Textarea name="complaint" />
          </div>
          <Button
            variant={"default"}
            type="submit"
            name="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
        <p className="text-md font-semibold text-center mt-4">{result}</p>
        {!loading && result && (
          <p className="text-md font-semibold text-center mt-2">
            Complain Submitted Successfully!
          </p>
        )}
      </Card>
    </div>
  );
}
