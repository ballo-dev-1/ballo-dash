import React, { useEffect,ReactElement } from 'react'
import BreadcrumbItem from '../../Common/BreadcrumbItem'
import Layout from "@layout/index";
import { Card, CardBody, CardHeader, Col, Form, Row } from 'react-bootstrap'
import animation from '@assets/images/light-box/l3.jpg'
// import "@assets\css\animate.min.css"
import "../../assets/css/animate.min.css"
import Image from 'next/image'

const AnimationPage = () => {
    useEffect(() => {
        const btnAnimate = document.querySelector('.triggerAnimation');
        if (btnAnimate) {
            btnAnimate.addEventListener('click', animate);
        }
        const selectAnimate = document.querySelector('.select-animations') as HTMLSelectElement | null;
        if (selectAnimate) {
            selectAnimate.addEventListener('change', animate);
        }

        return () => {
            if (btnAnimate) {
                btnAnimate.removeEventListener('click', animate);
            }
            if (selectAnimate) {
                selectAnimate.removeEventListener('change', animate);
            }
        };
    }, []);

    const animate = () => {
        const selectAnimate = document.querySelector('.select-animations') as HTMLSelectElement | null;
        const anim = selectAnimate?.value;
        const animationImage = document.querySelector('.animation-image') as HTMLElement | null;
        if (animationImage) {
            clearAnimate();
            if (anim) {
                animationImage.classList.add('animate__animated', `animate__${anim}`);
                setTimeout(clearAnimate, 1800);
            }
        }
    };

    const clearAnimate = () => {
        const animationImage = document.querySelector('.animation-image') as HTMLElement | null;
        if (animationImage) {
            animationImage.classList.remove('animate__animated');
            removeClassByPrefix(animationImage, 'animate__');
        }
    };

    const removeClassByPrefix = (el: HTMLElement, prefix: string) => {
        const regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        el.className = el.className.replace(regx, '');
        return el;
    };
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="UI Components" subTitle="Animation" />
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader>
                            <h5>Animation</h5>
                        </CardHeader>
                        <CardBody>
                            <Form className="animation-type">
                                <div className="container">
                                    <Row className="align-items-center mb-3">
                                        <Col lg={4} md={12} className="offset-lg-3">
                                            <select className="form-select select-animations">
                                                <optgroup label="Attention Seekers">
                                                    <option value="bounce">bounce</option>
                                                    <option value="flash">flash</option>
                                                    <option value="pulse">pulse</option>
                                                    <option value="rubberBand">rubberBand</option>
                                                    <option value="shake">shake</option>
                                                    <option value="swing">swing</option>
                                                    <option value="tada">tada</option>
                                                    <option value="wobble">wobble</option>
                                                    <option value="jello">jello</option>
                                                </optgroup>
                                                <optgroup label="Bouncing Entrances">
                                                    <option value="bounceIn">bounceIn</option>
                                                    <option value="bounceInDown">bounceInDown</option>
                                                    <option value="bounceInLeft">bounceInLeft</option>
                                                    <option value="bounceInRight">bounceInRight</option>
                                                    <option value="bounceInUp">bounceInUp</option>
                                                </optgroup>
                                                <optgroup label="Bouncing Exits">
                                                    <option value="bounceOut">bounceOut</option>
                                                    <option value="bounceOutDown">bounceOutDown</option>
                                                    <option value="bounceOutLeft">bounceOutLeft</option>
                                                    <option value="bounceOutRight">bounceOutRight</option>
                                                    <option value="bounceOutUp">bounceOutUp</option>
                                                </optgroup>
                                                <optgroup label="Fading Entrances">
                                                    <option value="fadeIn">fadeIn</option>
                                                    <option value="fadeInDown">fadeInDown</option>
                                                    <option value="fadeInDownBig">fadeInDownBig</option>
                                                    <option value="fadeInLeft">fadeInLeft</option>
                                                    <option value="fadeInLeftBig">fadeInLeftBig</option>
                                                    <option value="fadeInRight">fadeInRight</option>
                                                    <option value="fadeInRightBig">fadeInRightBig</option>
                                                    <option value="fadeInUp">fadeInUp</option>
                                                    <option value="fadeInUpBig">fadeInUpBig</option>
                                                </optgroup>
                                                <optgroup label="Fading Exits">
                                                    <option value="fadeOut">fadeOut</option>
                                                    <option value="fadeOutDown">fadeOutDown</option>
                                                    <option value="fadeOutDownBig">fadeOutDownBig</option>
                                                    <option value="fadeOutLeft">fadeOutLeft</option>
                                                    <option value="fadeOutLeftBig">fadeOutLeftBig</option>
                                                    <option value="fadeOutRight">fadeOutRight</option>
                                                    <option value="fadeOutRightBig">fadeOutRightBig</option>
                                                    <option value="fadeOutUp">fadeOutUp</option>
                                                    <option value="fadeOutUpBig">fadeOutUpBig</option>
                                                </optgroup>
                                                <optgroup label="Flippers">
                                                    <option value="flip">flip</option>
                                                    <option value="flipInX">flipInX</option>
                                                    <option value="flipInY">flipInY</option>
                                                    <option value="flipOutX">flipOutX</option>
                                                    <option value="flipOutY">flipOutY</option>
                                                </optgroup>
                                                <optgroup label="Lightspeed">
                                                    <option value="lightSpeedIn">lightSpeedIn</option>
                                                    <option value="lightSpeedOut">lightSpeedOut</option>
                                                </optgroup>
                                                <optgroup label="Rotating Entrances">
                                                    <option value="rotateIn">rotateIn</option>
                                                    <option value="rotateInDownLeft">rotateInDownLeft</option>
                                                    <option value="rotateInDownRight">rotateInDownRight</option>
                                                    <option value="rotateInUpLeft">rotateInUpLeft</option>
                                                    <option value="rotateInUpRight">rotateInUpRight</option>
                                                </optgroup>
                                                <optgroup label="Rotating Exits">
                                                    <option value="rotateOut">rotateOut</option>
                                                    <option value="rotateOutDownLeft">rotateOutDownLeft</option>
                                                    <option value="rotateOutDownRight">rotateOutDownRight</option>
                                                    <option value="rotateOutUpLeft">rotateOutUpLeft</option>
                                                    <option value="rotateOutUpRight">rotateOutUpRight</option>
                                                </optgroup>
                                                <optgroup label="Sliding Entrances">
                                                    <option value="slideInUp">slideInUp</option>
                                                    <option value="slideInDown">slideInDown</option>
                                                    <option value="slideInLeft">slideInLeft</option>
                                                    <option value="slideInRight">slideInRight</option>
                                                </optgroup>
                                                <optgroup label="Sliding Exits">
                                                    <option value="slideOutUp">slideOutUp</option>
                                                    <option value="slideOutDown">slideOutDown</option>
                                                    <option value="slideOutLeft">slideOutLeft</option>
                                                    <option value="slideOutRight">slideOutRight</option>
                                                </optgroup>
                                                <optgroup label="Zoom Entrances">
                                                    <option value="zoomIn">zoomIn</option>
                                                    <option value="zoomInDown">zoomInDown</option>
                                                    <option value="zoomInLeft">zoomInLeft</option>
                                                    <option value="zoomInRight">zoomInRight</option>
                                                    <option value="zoomInUp">zoomInUp</option>
                                                </optgroup>
                                                <optgroup label="Zoom Exits">
                                                    <option value="zoomOut">zoomOut</option>
                                                    <option value="zoomOutDown">zoomOutDown</option>
                                                    <option value="zoomOutLeft">zoomOutLeft</option>
                                                    <option value="zoomOutRight">zoomOutRight</option>
                                                    <option value="zoomOutUp">zoomOutUp</option>
                                                </optgroup>
                                                <optgroup label="Specials">
                                                    <option value="hinge">hinge</option>
                                                    <option value="rollIn">rollIn</option>
                                                    <option value="rollOut">rollOut</option>
                                                </optgroup>
                                            </select>
                                        </Col>
                                        <Col lg={3} md={12}>
                                            <button type="button" className="btn btn-primary triggerAnimation">Animate me!</button>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-center justify-content-center">
                                        <Col lg={6} sm={8}>
                                            <div className="text-center animation-image">
                                                <Image src={animation} alt="animate images" className='img-fluid img-thumbnail' priority />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

AnimationPage.getLayout = (page: ReactElement) => {
    return (
      <Layout>
        {page}
      </Layout>
    )
  };

export default AnimationPage