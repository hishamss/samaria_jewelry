import React, { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Modal, Dropdown } from "react-bootstrap";
import { Item, Sizes } from "../../types";
import { getStoreItems } from "../../utils/api"
import "./index.css";



const Shop = () => {
  const [storeItems, setStoreItems] = useState<Item[]>();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [itemId, setItemId] = useState<number>();
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState<number>();
  const [numOfOtherImages, setNumOfOtherImages] = useState<number>();
  const [sizes, setSizes] = useState<Sizes | null>();
  const showItemDetails = (item: Item) => {
    setShow(true);
    setItemId(item.id);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price);
    setNumOfOtherImages(item.numOfOtherImage);
    item.sizes ? setSizes(JSON.parse(item.sizes)) : setSizes(null);
    console.log(JSON.parse((item.sizes)!));
  }

  useEffect(() => {
    getStoreItems().then(result => {
      setStoreItems(result);
    })
  }, []);

  return <div>
    <div className="container-fluid shop-header">Welcome to Samaria Jewelry</div>
    <div className="container-fluid shop-sub-header mb-5">From the Holy Land</div>
    {/*  */}
    <Carousel variant="dark" className="mb-5">
      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100 carousel-image"
          src="images/shop-images.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100 carousel-image"
          src="images/shop-images.jpg"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100 carousel-image"
          src="images/shop-images.jpg"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>

    {/*  */}
    <div className="items mb-5">
      <Container fluid>

        <Row>
          {storeItems?.map((item: Item) => {

            return (
              <Col key={item.id} className="gy-5" sm={12} md={4} lg={3} onClick={() => showItemDetails(item)}>
                <img className="item-image" src={"images/items/item" + item.id + "/main.jpg"} alt={item.name} />
              </Col>
            )
          })}
        </Row>
      </Container>
    </div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="item-name">{itemName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel variant="dark" className="mb-3">
          {
            [...Array(numOfOtherImages)].map((_, index) => {

              return (
                <Carousel.Item>
                  <img
                    className="d-block w-100 other-images"
                    src={"images/items/item" + itemId + "/" + index + ".jpg"}
                    alt="First slide"
                  />
                </Carousel.Item>
              )
            })
          }



        </Carousel>
        {sizes ?
          <Dropdown className="sizes-menu mb-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Size
            </Dropdown.Toggle>
            <Dropdown.Menu>

              {Object.keys(sizes).map(size => sizes[size] !== 0 ? <Dropdown.Item href="#/action-3">{size}</Dropdown.Item> : null

              )}
            </Dropdown.Menu>
          </Dropdown> : null}
        <p className="item-description mb-3">{itemDescription}</p>
        <p className="item-price mb-3">${itemPrice}</p>
        <div className="text-center"><button className="add-to-cart-btn">Add To Cart</button></div>

      </Modal.Body>
    </Modal>
  </div>
}

export default Shop;