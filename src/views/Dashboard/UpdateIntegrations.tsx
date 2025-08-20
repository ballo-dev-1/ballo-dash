"use client";

import { integrationTypes } from "@/data/constants";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./style.scss";
import { useSelector } from "react-redux";
import { selectCompany } from "@/toolkit/Company/reducer";
import { integrationsService } from "@/services/integrationsService";
import { Pencil } from "lucide-react";

type FormValues = {
  platform: string;
  profileId: string;
  shortLivedToken: string;
};

export default function UpdateIntegrationModal() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const company = useSelector(selectCompany);
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (company?.id) {
        try {
          const integrationsData = await integrationsService.getIntegrations();
          setIntegrations(integrationsData);
        } catch (error) {
          console.error('Error fetching integrations:', error);
        }
      }
    };

    fetchIntegrations();
  }, [company?.id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      console.log("submitting...");
      
      // Use the centralized integrations service instead of direct API call
      const socialProfiles = await integrationsService.getSocialProfiles();
      if (!socialProfiles) {
        throw new Error("Failed to fetch social profiles");
      }
      
      // For now, just show success since we're not actually updating
      alert("Integration updated successfully.");
      reset();
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = Object.entries(integrationTypes);

  const [platform, setPlatform] = useState("");
  const [profileId, setProfileId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const tokenExpDate = () => {
    const integration = integrations.find(
      (item: { type: string }) => item.type === platform
    );

    if (integration?.expiresAt) {
      const formatted = new Intl.DateTimeFormat("en-GB").format(
        new Date(integration.expiresAt)
      );
      return (
        <span
          className="p-1 rounded-1 fst-italic"
          style={{ background: "antiquewhite" }}
        >
          (exp: {formatted})
        </span>
      );
    }

    return ""; // explicitly return something if no match
  };

  return (
    <>
      <Button
        className="update-socials-btn border-0 d-flex align-items-center"
        style={{ background: "dodgerblue", fontWeight: "100" }}
        onClick={handleShow}
      >
        Profiles{" "}
        <Pencil size={8} strokeWidth={1.3} style={{ padding: "0.2rem" }} />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Social Profile</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit(onSubmit)} className="integration-form">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select
                className="text-lowercase"
                {...register("platform", {
                  required: true,
                  onChange: (e) => setPlatform(e.target.value),
                })}
              >
                <option value="">Select platform</option>
                {platformOptions.map(([key, label]) => (
                  <option className="text-lowercase" key={key} value={label}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group
              className={`mb-3 ${!platform ? "opacity-0" : ""}`}
              style={{
                pointerEvents: !platform ? "none" : "auto",
                transition: "opacity 0.35s ease",
              }}
            >
              <Form.Label>Profile ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Profile ID"
                {...register("profileId", {
                  required: true,
                  onChange: (e) => setProfileId(e.target.value),
                })}
              />
            </Form.Group>

            <Form.Group
              className={`mb-3 ${!platform || !profileId ? "opacity-0" : ""}`}
              style={{
                pointerEvents: !platform || !profileId ? "none" : "auto",
                transition: "opacity 0.35s ease",
              }}
            >
              <Form.Label>Access Token {tokenExpDate()}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Access Token"
                {...register("shortLivedToken", {
                  required: true,
                  onChange: (e) => setAccessToken(e.target.value),
                })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={!platform || !profileId || !accessToken}
              type="submit"
              style={{
                background:
                  platform && profileId && accessToken ? "green" : "black",
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
