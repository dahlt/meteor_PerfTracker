import React, { Component } from "react";

export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: "Today",
            filteredData: []
        };
    }

    componentDidMount() {
        // eslint-disable-next-line react/prop-types
        const { employeeData } = this.props;
        const { selectedOption } = this.state;

        const storedOption = localStorage.getItem("selectedOption");
        const storedData = localStorage.getItem("filteredData");

        if (storedOption && storedData) {
            this.setState({
                selectedOption: storedOption,
                filteredData: JSON.parse(storedData)
            });
        } else {
            this.filterEmployeeData(employeeData, selectedOption);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedOption, filteredData } = this.state;

        if (
            selectedOption !== prevState.selectedOption ||
            filteredData !== prevState.filteredData
        ) {
            localStorage.setItem("selectedOption", selectedOption);
            localStorage.setItem("filteredData", JSON.stringify(filteredData));
        }
    }

    handleSelectChange = (event) => {
        const selectedOption = event.target.value;
        // eslint-disable-next-line react/prop-types
        const { employeeData } = this.props;

        this.setState({ selectedOption, filteredData: [] }, () => {
            this.filterEmployeeData(employeeData, selectedOption);
        });
    };

    filterEmployeeData = (data, option) => {
        let filteredData = [];
        if (option === "Today") {
            filteredData = data.filter(
                (employee) => employee.createdAt === "2023-07-05"
            );
        } else if (option === "Yesterday") {
            filteredData = data.filter(
                (employee) => employee.createdAt === "2023-07-04"
            );
        }

        this.setState({ filteredData });
    };

    render() {
        const { selectedOption, filteredData } = this.state;

        return (
            <div className="card_dashboard">
                {/* Rest of your component code */}
                <div className="w-form">
                    <form
                        id="email-form-2"
                        name="email-form-2"
                        data-name="Email Form 2"
                        method="get"
                    >
                        <div className="ry_cardtop">
                            <div className="card_dashboard-label">
                                Todays &#x27;Activity
                            </div>
                            <div>
                                <select
                                    id="field"
                                    name="field"
                                    data-name="Field"
                                    className="ry_selectfieldsmall w-select"
                                    value={selectedOption}
                                    onChange={this.handleSelectChange}
                                >
                                    <option value="Today">Today</option>
                                    <option value="Yesterday">Yesterday</option>
                                </select>
                            </div>
                        </div>
                        <div className="ry_cardcontent-style1">
                            {filteredData.map((employee, index) => (
                                <div className="ry_cardcontent_row" key={index}>
                                    <div className="ry_cardcontent_rowcol">
                                        <div className="ry_person-style2">
                                            <img
                                                src={employee.profilePicture}
                                                loading="lazy"
                                                alt=""
                                            />
                                        </div>
                                        <p className="ry_p-style1 mb-0">
                                            {employee.fullName}
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-25">
                                        <p className="ry_p-style1 mb-0">
                                            {employee.duration}
                                            To Fix
                                        </p>
                                    </div>
                                    <div className="ry_cardcontent_rowcol _w-10">
                                        <p className="ry_p-style1 mb-0 text-green">
                                            {employee.productivity}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                    <div className="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="w-form-fail">
                        <div>
                            Oops! Something went wrong while submitting the
                            form.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
