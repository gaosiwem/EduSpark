import { render } from "@testing-library/react";
import Page from "../app/page";
import React from "react";

it("renders homepage unchanged", () => {
  const { container } = render(<Page />);
  expect(container).toMatchSnapshot();
});
