import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isUserLoggedIn } from '../service/AuthApiService';
import WorkZenLogo from './WorkZenLogo';
import '../css/HomePage.css';

const HomePage = () => {
  const isAuth = isUserLoggedIn();

  return (
    <div className="center-in-page">
      <Container>
        <Row className="justify-content-center align-items-center text-center">
          <Col lg={8}>
            <div className="home-brand fade-in">
              <WorkZenLogo size="lg" />
            </div>
            <h1 className="fade-in">Calm focus for<br /><span>everyday work</span></h1>
            <p className="lead fade-in">
              WorkZen helps you organize priorities, due dates, and progress —
              a warm, focused space to get things done without the noise.
            </p>
            <div className="home-cta d-flex justify-content-center gap-3 fade-in">
              {isAuth ? (
                <Link to="/tasks" className="btn btn-primary">Go to my tasks</Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary">Log in</Link>
                  <Link to="/create-account" className="btn btn-outline-primary">Create account</Link>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
