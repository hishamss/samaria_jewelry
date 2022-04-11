import React, { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Modal, DropdownButton, Dropdown } from "react-bootstrap";
import { Item, CartItem, ItemSize } from "../../types";
import { getStoreItems } from "../../utils/api";
import { useDispatch } from "react-redux";
import { UpdateCartCount } from "../../redux/action-creators"
import "./index.css";



const Shop = () => {
  const dispatch = useDispatch();
  const [storeItems, setStoreItems] = useState<Item[]>([]);
  const [show, setShow] = useState(false);
  const handleClose = () => { setIsSizeSelected(false); setDisplaySelectSizeMsg({ opacity: 0 }); setShow(false); }
  const [itemId, setItemId] = useState<number>(0);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [numOfOtherImages, setNumOfOtherImages] = useState<number>();
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [itemSizes, setItemSizes] = useState<ItemSize[]>([]);
  const [isSizeSelected, setIsSizeSelected] = useState<boolean>(false);
  const [displaySelectSizeMsg, setDisplaySelectSizeMsg] = useState({ opacity: 0 });
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setIsSizeSelected(true);
    setDisplaySelectSizeMsg({ opacity: 0 });
  }

  const addItemToStorage = (item: CartItem) => {
    console.log("cartItem:", item)
    let myCart = localStorage.getItem("samaria-cart");
    // if cart empty
    if (!myCart) {
      localStorage.setItem("samaria-cart", JSON.stringify([item]));
      dispatch(UpdateCartCount(1));
    }
    // if cart not empty
    if (myCart) {
      let currentCart: CartItem[] = JSON.parse(myCart);
      console.log(currentCart)
      currentCart.forEach((inCartItem, index) => {
        if(inCartItem.id === item.id && inCartItem.size === item.size) {
          item.quantity =  inCartItem.quantity + 1;
          currentCart.splice(index,1);
        }
      })
      // add new item to cart
      currentCart.push(item);
      //update cart
      localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
      dispatch(UpdateCartCount(currentCart.length));
    }




  }
  const handleAddToCart = () => {
    // if item has size but still no size selected
    if (itemSizes[0].size !== 'all' && !isSizeSelected) {
      setDisplaySelectSizeMsg({ opacity: 1 });
      return
    }
    let cartItem: CartItem =
    {
      id: itemId,
      name: itemName,
      price: itemPrice,
      size: selectedSize,
      quantity: 1
    }

    addItemToStorage(cartItem);
    setIsSizeSelected(false);
    setShow(false);
    setDisplaySelectSizeMsg({ opacity: 0 });


  }

  const showItemDetails = (item: Item) => {
    setSelectedSize("all")
    setItemSizes(item.sizes);
    setItemId(item.id);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price);
    setNumOfOtherImages(item.numOfOtherImage);
    setShow(true);
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
          {storeItems.map((item: Item) => {

            return (
              <Col key={item.id} className="gy-5" sm={12} md={4} lg={3} onClick={() => showItemDetails(item)}>
                <img className="item-image" loading="lazy" key={item.id}
                  decoding="async" src={`https://samaria-item-images.s3.us-east-2.amazonaws.com/${(item.name).replace(/ /g, "+")}/main.jpg`} alt={item.name} />
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
                    src={`https://samaria-item-images.s3.us-east-2.amazonaws.com/${itemName.replace(/ /g, "+")}/${index+1}.jpg`}
                    loading="lazy"
                    decoding="async"
                    alt="other-images"
                    key={index}
                  />
                </Carousel.Item>
              )
            })
          }



        </Carousel>
        {
          itemSizes.length === 1 && itemSizes[0].size === 'all' ? null : (

            <DropdownButton className="sizes-menu mb-1" title={selectedSize === "all" ? "Select Size" : selectedSize}>

              {itemSizes.map(sizeObj => {
                return <Dropdown.Item onClick={() => handleSelectSize(sizeObj.size)}>
                  {sizeObj.size}
                </Dropdown.Item>
              })}

            </DropdownButton>
          )

        }



        <p className="add-item-err-mssg mb-3" style={displaySelectSizeMsg}>* Please select size</p>
        <p className="item-description mb-3">{itemDescription}</p>
        <p className="item-price mb-3">${itemPrice}</p>

        <div className="text-center"><button className="add-to-cart-btn" onClick={() => handleAddToCart()}>Add To Cart</button></div>
        <div className="text-center" id="empty-cart-mssg">
          <i className="fas fa-exclamation-triangle"></i> Your items will be removed from cart if you refresh or close the page
        </div>

      </Modal.Body>
    </Modal>
  </div>
}

export default Shop;