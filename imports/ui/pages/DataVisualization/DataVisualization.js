import { select, axisBottom, axisLeft, scaleBand, scaleLinear, max } from "d3";
import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import autoBind from "react-autobind";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import {
  CleanUpDataStaffByOrigin,
  CleanUpDataStaffType,
  CleanUpDataSexDistribution
} from "../../../modules/chartUtilities";
const DataVizStyles = styled.div`
  text {
    font-size: 14px;
  }

  .tick text {
    fill: #635f5d;
  }

  .tick line {
    stroke: #c0c088;
  }

  .viz-title {
    text-transform: uppercase;
    font-size: 17px;
    fill: green;
  }

  .small-title {
  }

  .axis path,
  .axis line {
    shape-rendering: crispEdges;
  }

  .bar {
    fill: steelblue;
  }

  .bar:hover {
    fill: orangered;
  }

  .x.axis path {
    display: none;
  }
`;

export default class DataVisualization extends Component {
  constructor(props) {
    super();
    this.state = {
      data: []
    };
    autoBind(this);
  }

  makeRemoteDataCall(methodName, option) {
    return new Promise((resolve, reject) => {
      if (option) {
        Meteor.call(methodName, option, function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } else {
        Meteor.call(methodName, function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    });
  }

  //data
  //xvalue -- d => d.count;
  //yvalue
  //chartTitle
  //xAxisTitle

  async getDataVizData(e) {
    const value = e.target.value;
    if (value == "1") {
      //get the data for visualization by state of origin
      const result = await this.makeRemoteDataCall(
        "staffmembers.getstaffcountbystateoforigin"
      );
      const chartData = CleanUpDataStaffByOrigin(result);
      this.drawBarChart(chartData);
    } else if (value == "2") {
      const result = await this.makeRemoteDataCall(
        "staffmembers.getstaffcountbydesignation",
        "1"
      );
      const chartData = CleanUpDataStaffType(result, "Academic");
      this.drawBarChart(chartData);
    } else if (value == "3") {
      const result = await this.makeRemoteDataCall(
        "staffmembers.getstaffcountbydesignation",
        "2"
      );
      const chartData = CleanUpDataStaffType(result, "Non Teaching");
      this.drawBarChart(chartData);
    } else if (value == "4") {
      const result = await this.makeRemoteDataCall(
        "staffmembers.getstaffcountbysex"
      );
      const chartData = CleanUpDataSexDistribution(result);
      this.drawBarChart(chartData);
    }
  }

  removeChartElement() {
    const node = this.node;
    const svg = select(node);
    svg.selectAll("*").remove();
  }

  drawBarChart(chartData) {
    this.removeChartElement();
    const node = this.node;
    const {
      data,
      xValue,
      yValue,
      chartTitle,
      xAxisTitle,
      left,
      svgHeight,
      bottom
    } = chartData;
    const svg = select(node);
    const width = svg.attr("width");
    const height = svgHeight ? svgHeight : 700;
    svg.attr("height", height);
    const margin = {
      left: left || 90,
      right: 20,
      top: 90,
      bottom: bottom || 70
    };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, innerWidth]);

    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.2);

    const yAxis = axisLeft(yScale);
    const xAxis = axisBottom(xScale);
    //.tickSize(-innerHeight);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .call(yAxis)
      .selectAll(".domain, .tick line")
      .remove();

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);

    xAxisG.select(".domain").remove();
    xAxisG
      .append("text")
      .attr("y", 40)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .attr("class", "small-title")
      .text(xAxisTitle);

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(yValue(d)))
      .attr("width", d => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
      .on("mouseover", function() {
        select(this).attr("fill", "orangered");
      })
      .on("mouseout", function(d, i) {
        select(this).attr("fill", function() {
          return "steelblue";
        });
      })
      .append("title")
      .text(function(d) {
        return d.count;
      });

    g.append("text")
      .attr("y", -10)
      .attr("x", innerWidth / 2 - 75)
      .attr("class", "viz-title")
      .text(chartTitle);
  }

  render() {
    return (
      <DataVizStyles>
        <Row>
          <Col md={6}>
            <select className="form-control" onChange={this.getDataVizData}>
              <option value="0">select a stats</option>
              <option value="1">staff data visualization by state</option>
              <option value="2">academic staff data </option>
              <option value="3">non academic staff data </option>
              <option value="4">sex distribution </option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <svg ref={node => (this.node = node)} width={960}></svg>
          </Col>
        </Row>
      </DataVizStyles>
    );
  }
}
