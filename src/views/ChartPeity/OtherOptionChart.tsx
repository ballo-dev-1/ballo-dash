import React from 'react'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'

const OtherOptionChart = () => {
  return (
    <React.Fragment>
            <Col sm={12}>
          <Card>
            <CardHeader>
              <h5>Other Options</h5>
            </CardHeader>
            <CardBody>
              <p className="data-attributes">
                <span className='pe-1'
                  data-peity='{ "fill": ["red", "#eeeeee"],    "innerRadius": 10, "radius": 40 }'><svg className="peity" width="80" height="80"><path d="M 40 0 A 40 40 0 0 1 71.2732592987212 15.060407925650662 L 47.8183148246803 33.76510198141266 A 10 10 0 0 0 40 30" data-value="1" fill="red"></path><path d="M 71.2732592987212 15.060407925650662 A 40 40 0 1 1 39.99999999999999 0 L 40 30 A 10 10 0 1 0 47.8183148246803 33.76510198141266" data-value="6" fill="#eeeeee"></path></svg></span>
                <span className='pe-1'
                  data-peity='{ "fill": ["orange", "#eeeeee"], "innerRadius": 14, "radius": 36 }'><svg className="peity" width="72" height="72"><path d="M 36 0 A 36 36 0 0 1 71.09740483854566 44.010753622427316 L 49.64899077054553 39.1152930753884 A 14 14 0 0 0 36 22" data-value="2" fill="orange"></path><path d="M 71.09740483854566 44.010753622427316 A 36 36 0 1 1 35.99999999999999 0 L 36 22 A 14 14 0 1 0 49.64899077054553 39.1152930753884" data-value="5" fill="#eeeeee"></path></svg></span>
                <span className='pe-1'
                  data-peity='{ "fill": ["yellow", "#eeeeee"], "innerRadius": 16, "radius": 32 }'><svg className="peity" width="64" height="64"><path d="M 32 0 A 32 32 0 0 1 45.88427965176186 60.83100377287741 L 38.94213982588093 46.415501886438705 A 16 16 0 0 0 32 16" data-value="3" fill="yellow"></path><path d="M 45.88427965176186 60.83100377287741 A 32 32 0 1 1 31.999999999999993 0 L 31.999999999999996 16 A 16 16 0 1 0 38.94213982588093 46.415501886438705" data-value="4" fill="#eeeeee"></path></svg></span>
                <span className='pe-1'
                  data-peity='{ "fill": ["green", "#eeeeee"],  "innerRadius": 18, "radius": 28 }'><svg className="peity" width="56" height="56"><path d="M 28 0 A 28 28 0 1 1 15.851255304708374 53.22712830126774 L 20.190092695883955 44.217439622243546 A 18 18 0 1 0 28 10" data-value="4" fill="green"></path><path d="M 15.851255304708374 53.22712830126774 A 28 28 0 0 1 27.999999999999996 0 L 27.999999999999996 10 A 18 18 0 0 0 20.190092695883955 44.217439622243546" data-value="3" fill="#eeeeee"></path></svg></span>
                <span className='pe-1'
                  data-peity='{ "fill": ["blue", "#eeeeee"],   "innerRadius": 20, "radius": 24 }'><svg className="peity" width="48" height="48"><path d="M 24 0 A 24 24 0 1 1 0.6017301076362322 29.340502414951548 L 4.501441756363526 28.45041867912629 A 20 20 0 1 0 24 4" data-value="5" fill="blue"></path><path d="M 0.6017301076362322 29.340502414951548 A 24 24 0 0 1 23.999999999999996 0 L 23.999999999999996 4 A 20 20 0 0 0 4.501441756363526 28.45041867912629" data-value="2" fill="#eeeeee"></path></svg></span>
                <span className='pe-1'
                  data-peity='{ "fill": ["violet", "#eeeeee"], "innerRadius": 15, "radius": 16 }'><svg className="peity" width="32" height="32"><path d="M 16 0 A 16 16 0 1 1 15.99 0 L 15.99 1 A 15 15 0 1 0 16 1" data-value="7" fill="violet"></path></svg></span>
              </p>
            </CardBody>
          </Card>
        </Col>
    </React.Fragment>
  )
}

export default OtherOptionChart
