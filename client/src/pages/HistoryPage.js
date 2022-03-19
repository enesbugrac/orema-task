import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getHistory } from "../redux/user/user.actions";

export function HistoryPage(props) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    console.log("AAA");
    dispatch(getHistory()).then(async (response) =>
      setHistory(response.payload)
    );
  }, [dispatch]);

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>History</h1>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th>Payment Id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date of Purchase</th>
          </tr>
        </thead>

        <tbody>
          {history.length > 0 &&
            history.map((item) => (
              <tr key={item.id}>
                <td>{item.payment_id}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.dateOfPurchase}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
