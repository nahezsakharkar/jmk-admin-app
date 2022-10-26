import "./Featured.scss";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = ({ received, expected, lastMonth }) => {

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const percentage = ((received / expected) * 100).toFixed(2)

    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Total Revenue</h1>
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={isNaN((percentage)) ? 0 : percentage} text={isNaN((percentage)) ? (0 + "%") : (percentage + "%")} strokeWidth={5} />
                </div>
                <p className="title">Total Payment Received Till Date</p>
                <p className="amount">{commasMoney(received)}/-</p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Target</div>
                        <div className="itemResult negative">
                            <KeyboardArrowDownIcon fontSize="small" />
                            <div className="resultAmount">{commasMoney(expected)}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Last Month</div>
                        <div className="itemResult positive">
                            <KeyboardArrowUpOutlinedIcon fontSize="small" />
                            <div className="resultAmount">{commasMoney(lastMonth)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Featured;
