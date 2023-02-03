import React, { Component } from "react";

import { connect } from "react-redux";
import authToken from "./../../utils/authToken";
import {
  saveOffre,
} from "../../services/index";

import { Card, Form, Table, FormControl, InputGroup, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faPlusSquare,
  faUndo,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import MyToast from "../MyToast";
import axios from "axios";

class Offre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prix: "",
      show: false,
      message: "",
      type: "",
      offres: [],
      currentPage: 1,
      offresPerPage: 5,
      sortDir: "desc",
    };
  }

  componentDidMount() {
    this.findAllOffres(this.state.currentPage);
  }

  findAllOffres(currentPage) {
    currentPage -= 1;
    axios
      .get(
        "https://auctionsale-cloud-webservice-production.up.railway.app/offres?pageNumber=" +
          currentPage +
          "&pageSize=" +
          this.state.offresPerPage +
          "&sortBy=prix&sortDir=" +
          this.state.sortDir +
          "&enchere_id=" + this.props.match.params.enchere_id
      )
      .then((response) => response.data)
      .then((data) => {
        this.setState({
          offres: data.content,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          currentPage: data.number + 1,
        });
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("jwtToken");
        this.props.history.push("/");
      });
  }

  changePage = (event) => {
    let targetPage = parseInt(event.target.value);
    if (this.state.search) {
      this.searchData(targetPage);
    } else {
      this.findAllOffres(targetPage);
    }
    this.setState({
      [event.target.name]: targetPage,
    });
  };

  firstPage = () => {
    let firstPage = 1;
    if (this.state.currentPage > firstPage) {
      if (this.state.search) {
        this.searchData(firstPage);
      } else {
        this.findAllOffres(firstPage);
      }
    }
  };

  prevPage = () => {
    let prevPage = 1;
    if (this.state.currentPage > prevPage) {
      if (this.state.search) {
        this.searchData(this.state.currentPage - prevPage);
      } else {
        this.findAllOffres(this.state.currentPage - prevPage);
      }
    }
  };

  lastPage = () => {
    let condition = Math.ceil(
      this.state.totalElements / this.state.offresPerPage
    );
    if (this.state.currentPage < condition) {
      if (this.state.search) {
        this.searchData(condition);
      } else {
        this.findAllOffres(condition);
      }
    }
  };

  nextPage = () => {
    if (
      this.state.currentPage <
      Math.ceil(this.state.totalElements / this.state.offresPerPage)
    ) {
      if (this.state.search) {
        this.searchData(this.state.currentPage + 1);
      } else {
        this.findAllOffres(this.state.currentPage + 1);
      }
    }
  };

  submitOffre = (event) => {
    event.preventDefault();

    const offre = {
      prix: this.state.prix,
    };

    this.props.saveOffre(offre, this.props.match.params.enchere_id, this.props.auth.username);
    setTimeout(() => {
      if (this.props.offreObject.offre !== "") {
        this.setState({ show: true, message: "Offre sauvegardée.", type: "success", method: "post" });
        setTimeout(() => this.setState({ show: false }), 4000);
      } else {
        this.setState({ show: true, message: "Offre ou solde insuffisant , ou enchère terminée.", type: "error", method: "post" });
        setTimeout(() => this.setState({ show: false }), 4000);
      }
    }, 2000);
    this.findAllOffres(this.state.currentPage);
  };

  offreChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  refresh = () => {
    this.findAllOffres(this.state.currentPage);
  };

  render() {
    const { prix, offres, currentPage, totalPages } = this.state;

    return (
      <div>
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={this.state.message}
            type={this.state.type}
          />
        </div>
        <Card className={"border border-dark bg-dark text-white"}>
            <Card.Header>
              <FontAwesomeIcon icon={faPlusSquare} />{"  "}
            </Card.Header>
            <Form
              onSubmit={this.submitOffre}
              id="offreFormId"
            >
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridPrice">
                  <Form.Label>Combien proposez-vous ?</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="test"
                    name="prix"
                    value={prix}
                    onChange={this.offreChange}
                    className={"bg-dark text-white"}
                    placeholder="0 Ar"
                  />
                </Form.Group>
              </Form.Row>
              <Button size="sm" variant="success" type="submit">
                  <FontAwesomeIcon icon={faSave} />{" "}
                  Enchérir
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                type="button"
                onClick={() => this.refresh()}
                >
              <FontAwesomeIcon icon={faUndo} /> Rafraîchir
              </Button>
            </Card.Body>
            </Form>
            <Card.Body>
              <Table bordered hover striped variant="dark">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Date</th>
                    <th>Offre</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {offres.length === 0 ? (
                    <tr align="center">
                      <td colSpan="7">Aucunes offres.</td>
                    </tr>
                  ) : (
                    offres.map((offre) => (
                      <tr key={offre.id}>
                        <td>{offre.user.name}</td>
                        <td>{offre.date}</td>
                        <td>{offre.prix} Ar</td>
                        <td>{offre.statut}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
            {offres.length > 0 ? (
            <Card.Footer>
              <div style={{ float: "left" }}>
                Showing Page {currentPage} of {totalPages}
              </div>
              <div style={{ float: "right" }}>
                <InputGroup size="sm">
                  <InputGroup.Prepend>
                    <Button
                      type="button"
                      variant="outline-info"
                      disabled={currentPage === 1 ? true : false}
                      onClick={this.firstPage}
                    >
                      <FontAwesomeIcon icon={faFastBackward} /> First
                    </Button>
                    <Button
                      type="button"
                      variant="outline-info"
                      disabled={currentPage === 1 ? true : false}
                      onClick={this.prevPage}
                    >
                      <FontAwesomeIcon icon={faStepBackward} /> Prev
                    </Button>
                  </InputGroup.Prepend>
                  <FormControl
                    className={"page-num bg-dark"}
                    name="currentPage"
                    value={currentPage}
                    onChange={this.changePage}
                  />
                  <InputGroup.Append>
                    <Button
                      type="button"
                      variant="outline-info"
                      disabled={currentPage === totalPages ? true : false}
                      onClick={this.nextPage}
                    >
                      <FontAwesomeIcon icon={faStepForward} /> Next
                    </Button>
                    <Button
                      type="button"
                      variant="outline-info"
                      disabled={currentPage === totalPages ? true : false}
                      onClick={this.lastPage}
                    >
                      <FontAwesomeIcon icon={faFastForward} /> Last
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </Card.Footer>
            ) : null}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }
  return {
    offreObject: state.offre,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveOffre: (offre, enchere_id, email) => dispatch(saveOffre(offre, enchere_id, email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Offre);
