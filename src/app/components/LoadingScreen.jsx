import { Spin } from "antd";
import PropTypes from 'prop-types';

const LoadingScreen = ({ loading }) => {
    if (!loading) return null;
    
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',          
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                textAlign: 'center',     
            }}>
                <h4 style={{
                    marginBottom: '16px',
                    color: '#555',
                    fontSize: '16px'
                }}>
                    We are loading your Menus...
                </h4>
                <Spin size="large">
                    <div style={{
                        padding: '24px',
         
                      
                    }}>
                        Please wait...
                    </div>
                </Spin>
            </div>
        </div>
    );
};
LoadingScreen.propTypes = {
    loading: PropTypes.bool.isRequired,
};

export default LoadingScreen;
