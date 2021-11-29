import React, { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Modal, DropdownButton, Dropdown } from "react-bootstrap";
import { Item, Sizes, CartItem} from "../../types";
import { getStoreItems } from "../../utils/api"
import "./index.css";



const Shop = () => {
  const [storeItems, setStoreItems] = useState<Item[]>();
  const [show, setShow] = useState(false);
  const handleClose = () => { setHasSizes(false); setDisplaySelectSizeMsg({ opacity: 0 }); setShow(false); }
  const [itemId, setItemId] = useState<number | undefined>();
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState<number>();
  const [numOfOtherImages, setNumOfOtherImages] = useState<number>();
  const [quantity, setQuantity] = useState<Sizes | undefined>();
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [hasSizes, setHasSizes] = useState<boolean>(false);
  const [displaySelectSizeMsg, setDisplaySelectSizeMsg] = useState({ opacity: 0 });
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setHasSizes(true);
    setDisplaySelectSizeMsg({ opacity: 0 });
  }

  const addItemToStorage = (item: CartItem) => {
    let myCart = localStorage.getItem("samaria-cart");
    if (!myCart) localStorage.setItem("samaria-cart", JSON.stringify(item));
    if (myCart) {
      let currentCart = JSON.parse(myCart);
      // check if item is in the cart
      if (currentCart!.hasOwnProperty(itemId)) {
        // check if the item size in the cart. If yes, increase the quantity by 1
        if (currentCart[itemId!]!.hasOwnProperty(selectedSize)) currentCart[itemId!][selectedSize].quantity += 1;
        // check if the item size is not the cart. If yes, add item size to the cart
        if (!currentCart[itemId!]!.hasOwnProperty(selectedSize)) currentCart[itemId!][selectedSize] = item[itemId!][selectedSize];
      }
      // add new item to cart
      if (!currentCart!.hasOwnProperty(itemId)) currentCart[itemId!] = item[itemId!];

      //update cart
      localStorage.setItem("samaria-cart", JSON.stringify(currentCart));

    }


  }
  const handleAddToCart = () => {
    if (hasSizes || quantity!.hasOwnProperty("all")) {
      let cartItem:CartItem =
      {
        [itemId!]:
        {
          [selectedSize]:
          {
            name: itemName,
            quantity: 1,
            price: itemPrice!,
          }
        }
      }

      addItemToStorage(cartItem);
      setHasSizes(false);
      setShow(false);
      setDisplaySelectSizeMsg({ opacity: 0 });
    } else {
      setDisplaySelectSizeMsg({ opacity: 1 });
    }

  }

  const showItemDetails = (item: Item) => {
    setSelectedSize("all")
    setShow(true);
    setItemId(item.id);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price);
    setNumOfOtherImages(item.numOfOtherImage);
    setQuantity(JSON.parse(item.quantity));
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
                    key={index}
                  />
                </Carousel.Item>
              )
            })
          }



        </Carousel>
        {quantity ?
          (quantity.hasOwnProperty("all") ? null :

            <DropdownButton className="sizes-menu mb-1" title={selectedSize === "all" ? "Select Size" : selectedSize}>



              {Object.keys(quantity).map(size => quantity[size] !== 0 ? <Dropdown.Item onClick={() => handleSelectSize(size)}>{size}</Dropdown.Item> : null

              )}

            </DropdownButton>
          ) : null


        }
        <p className="add-item-err-mssg mb-3" style={displaySelectSizeMsg}>* Please select size</p>
        <p className="item-description mb-3">{itemDescription}</p>
        <p className="item-price mb-3">${itemPrice}</p>

        <div className="text-center"><button className="add-to-cart-btn" onClick={() => handleAddToCart()}>Add To Cart</button></div>

      </Modal.Body>
    </Modal>
  </div>
}

export default Shop;