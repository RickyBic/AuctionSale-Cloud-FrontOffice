import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const Welcome = (props) => {
  const [encheres, setEncheres] = useState("");

  useEffect(() => {
    if (encheres === "") {
      axios.get("https://auctionsale-cloud-webservice-production.up.railway.app/encheres/collection").then((response) => {
        setEncheres(response.data);
      });
    }
  }, [encheres]);

  return (
    <Card bg="dark" text="light">
      <Card.Header>Liste des enchères</Card.Header>
      <Card.Body style={{ overflowY: "scroll", height: "570px" }}>
        {encheres &&
          encheres.map((enchere, id) => (
            <blockquote className="blockquote mb-0" key={id}>
              <p>{enchere.description} à partir de {enchere.prixdepart}.0 Ariary.</p>
              <footer className="blockquote-footer">Propriétaire: {enchere.user.name}, Catégorie: {enchere.categorie.name}, Fin: {enchere.datefin}</footer>
            </blockquote>
          ))}
      </Card.Body>
    </Card>
  );
};

export default Welcome;
