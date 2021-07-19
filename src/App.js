import React, { useState } from 'react';
import DataTable from "react-data-table-component";
import { Scatter } from 'react-chartjs-2';
import { orderBy } from 'lodash';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Card, Container, Col, Row, Tab, Tabs, Image } from 'react-bootstrap';
// import datasets from "./datasets/produksi_padi";
import datasets from "./datasets/rainfall_uk";
import './styles.css';
import logo from './logo.svg';
import Regresi from './utils/Regresi';

const columns = [
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
  },
  {
    name: 'Period',
    selector: 'period',
    sortable: true,
  },
  {
    name: 'Average Rainfall (mm)',
    selector: 'x',
    sortable: true,
  },
  {
    name: 'Average Temp (celsius)',
    selector: 'y',
    sortable: true,
  },

]

function App() {
  const [loading, setLoading] = useState(false);
  const [items, setData] = useState(datasets);
  const [key, setKey] = useState('home');

  const regresi = new Regresi(datasets, "Average Rainfall", "Average Temp")

  const { value, type, power } = regresi.correlation()

  const [regression, setRegression] = useState(regresi)
  const [xValue, setxValue] = useState("")
  const [predict, setPredict] = useState("")

  console.log(regresi.model_formula())

  const data = {
    labels: ["Average Rainfall", "Produksi Padi"],
    datasets: [
      {
        label: 'Datasets',
        data: items,
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  }
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  const handleSort = (column, sortDirection) => {
    setLoading(true);
    setTimeout(() => {
      setData(orderBy(items, column.selector, sortDirection));
      setLoading(false);
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    let predict = regresi.predict(xValue)
    setPredict(predict)
  }



  return (
    <div className="App">
      <Container className="px-4 pt-5 my-5 text-center border-bottom">
        <h1 className="display-4 fw-bold">Regresi Sederhana Menggunakan React.js</h1>
        <Col lg={6} className="mx-auto">
          <p className="lead mb-4">Nama : Mohamad Muqiit Faturrahman</p>
          <p className="lead mb-4">NRP : 15-2018-016</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <a href="#content" className="btn btn-outline-secondary btn-lg px-4">Scroll Down</a>
          </div>
        </Col>
        <div className="overflow-hidden" style={{ maxHeight: '70vh' }}>
          <Container className="px-5">
            <Image src={logo} className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy" />
          </Container>
        </div>
      </Container>
      <Container id="content" className="py-5">
        <Row className="text-center mb-5">
          <h1>Regresi</h1>
        </Row>
        <Row>
          <Col lg={6} md={4} sm={12}>
            <Card className="mb-4" style={{ color: "#000" }}>
              <Card.Body>
                <Card.Title>
                  Datasets
                </Card.Title>
                <DataTable
                  columns={columns}
                  data={items}
                  onSort={handleSort}
                  sortServer
                  progressPending={loading}
                  persistTableHead
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="home" title="Model Regresi">
                <h1>Model Regresi</h1>
                <p>Model regresi yang di dapat dari datasets adalah : </p>
                <p>{regression.model_formula()}</p>
                <Row className="d-flex justify-content-center">
                  <Col sm={8}>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>{regresi.labelX}</Form.Label>
                        <Form.Control type="text" placeholder="Nilai x" value={xValue} onChange={(e) => setxValue(e.target.value)} />
                        <Form.Text className="text-muted">
                          Masukkan nilai x ({regresi.labelX}) untuk melakukan percobaan <br />
                        </Form.Text>
                        <Form.Text>
                          Nilai x = {xValue}
                        </Form.Text>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                      <p>
                        Prediksi {regresi.labelY} = {predict}
                      </p>
                    </Form>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="korelasi" title="Korelasi">
                <h1>Korelasi</h1>
                <p>Nilai korelasi : {value}</p>
                <p className="text-muted">Dengan jenis hubungan {type} dan kekuatan {power}</p>
                Besar kontribusi dari variabel {regresi.labelX} terhadap {regresi.labelY} adalah {regresi.koef_determination()}%
                <br />
                Sisanya {regresi.another_factor()}% merupakan kontribusi dari variable selain {regresi.labelX}
              </Tab>
              <Tab eventKey="grafik" title="Grafik">
                <Scatter data={data} options={options} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default App;
