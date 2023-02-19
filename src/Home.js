import React, { useEffect, useRef } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Table } from "@mantine/core";

export const Home = () => {
  //const [P, setP] = useState(second)
  const inputRef = useRef(null);
  const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // 상점을 특정하는 키
  const customerKey = "YbX2HuSlsC9uVJW6NMRMj"; // 결제 고객을 특정하는 키
  const amount = 15_000; // 결제 금액
  const couponAmount = 5_000 || 0; // 할인 쿠폰 금액

  useEffect(() => {
    loadPaymentWidget(clientKey, customerKey).then((paymentWidget) => {
      paymentWidget.renderPaymentMethods("#payment-method", amount);
      paymentWidget.renderAgreement("#agreement");
    });
  }, []);

  const handleClick = async () => {
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
    const paymentMethods = paymentWidget.renderPaymentMethods(
      "#payment-method",
      amount
    );
    paymentMethods.updateAmount(
      inputRef.current.checked ? amount - couponAmount : amount,
      "쿠폰"
    );

    paymentWidget
      .requestPayment({
        orderId: "AD8aZDpbzXs4EQa-UkIX6",
        orderName: "토스 티셔츠",
        successUrl: "http://localhost:3000/success",
        failUrl: "http://localhost:3000/fail",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      })
      .catch(function (error) {
        if (error.code === "USER_CANCEL") {
          alert("결제가 취소되었습니다.");
        }
        if (error.code === "INVALID_CARD_COMPANY") {
          alert("카드 정보가 올바르지 않습니다.");
        }
      });
  };

  const elements = [{ name: "토스 티셔츠", price: amount }];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.price}</td>
    </tr>
  ));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
        <div className="title" style={{ flex: 1 }}>
          상품 정보
        </div>
        <Table style={{ flex: 1 }}>
          <thead>
            <tr>
              <th>상품이름</th>
              <th>상품가격</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>

      <form id="discount-coupon">
        <input ref={inputRef} type="checkbox" id="coupon" />
        5,000원 할인받기
      </form>

      <div className="title">결제 방법</div>
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <button id="payment-button" type="button" onClick={() => handleClick()}>
        결제하기
      </button>
    </>
  );
};
