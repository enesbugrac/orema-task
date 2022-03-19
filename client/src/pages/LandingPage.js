import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import CheckBox from "../components/LandingPage/CheckBox";
import RadioBox from "../components/LandingPage/RadioBox";
import ImageSlider from "..//components/ImageSlider";
import { types, price } from "../components/LandingPage/Datas";
import SearchFeature from "../components/LandingPage/SearchFeature";
import axios from "axios";
import { loadCurrentItem } from "../redux/product/product.actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const { Meta } = Card;

export function LandingPage(props) {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState();
  const [SearchTerms, setSearchTerms] = useState("");
  const [priceRange, setPriceRange] = useState([]);
  const [typeArray, setTypeArray] = useState([]);
  const [Filters, setFilters] = useState({
    types: [],
    price: [],
  });
  console.log(useSelector((store) => store));
  const dispatch = useDispatch();
  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(queryString(variables));
  }, [Limit, Skip]);
  const queryString = (data) => {
    return Object.keys(data)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  };
  const getProducts = (variables) => {
    axios
      .get(`http://localhost:5000/api/products/allproducts?${variables}`)
      .then((response) => {
        console.log(response);
        if (response) {
          if (variables.loadMore) {
            setProducts([...Products, ...response.data]);
          } else {
            setProducts(response.data);
          }
          setPostSize(response.data);
        } else {
          alert("Failed to fectch product datas");
        }
      });
  };
  const detailPageHandler = (product) => {
    console.log(product);
    dispatch(loadCurrentItem(product)).then(() => {});
  };
  const onLoadMore = () => {
    let skip = Skip + Limit;
    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
      searchterm: SearchTerms,
    };
    const reqQuery =
      queryString(variables) +
      toQuery(priceRange, "price") +
      toQuery(typeArray, "type");
    getProducts(reqQuery);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24}>
        <Card
          hoverable={true}
          onClick={() => detailPageHandler(product)}
          cover={
            <Link to={`/product/${product._id}`}>
              <ImageSlider key={product._id} image={product.image} />
            </Link>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let variables = {};
    if (SearchTerms === "") {
      variables = {
        skip: 0,
        limit: Limit,
      };
    } else {
      variables = {
        skip: 0,
        limit: Limit,
        searchterm: SearchTerms,
      };
    }
    const reqQuery =
      queryString(variables) +
      toQuery(filters["price"], "price") +
      toQuery(handleTypes(filters["types"]), "type");
    getProducts(reqQuery);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };
  const handleTypes = (value) => {
    let array = [];
    value.map((e) => array.push(e.type));
    return array;
  };
  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    console.log(filters);
    if (category === "types") {
      let typeNames = handleTypes(filters);
      setTypeArray(typeNames);
      newFilters["types"] = filters;
    }
    if (category === "price") {
      let priceValues = handlePrice(filters);
      setPriceRange(priceValues);
      newFilters[category] = priceValues;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };
  const toQuery = (arr, filterType) => {
    var rv = "&";
    for (var i = 0; i < arr.length; ++i) rv += "&" + filterType + "=" + arr[i];
    return rv;
  };
  const updateSearchTerms = (newSearchTerm) => {
    let variables = {};
    if (newSearchTerm === "") {
      variables = {
        skip: 0,
        limit: Limit,
      };
    } else {
      variables = {
        skip: 0,
        limit: Limit,
        searchterm: newSearchTerm,
      };
    }

    const reqQuery =
      queryString(variables) +
      toQuery(priceRange, "price") +
      toQuery(typeArray, "type");
    console.log(reqQuery);

    setSkip(0);
    setSearchTerms(newSearchTerm);

    getProducts(reqQuery);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          Products <Icon type="basket" />{" "}
        </h2>
      </div>

      {/* Filter  */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            list={types}
            handleFilters={(filters) => handleFilters(filters, "types")}
          />
        </Col>
        <Col lg={12} xs={24}>
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search  */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div>

      {Products.length === 0 ? (
        <div
          style={{
            display: "flex",
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>No post yet...</h2>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
      )}
      <br />
      <br />

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}
