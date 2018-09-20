import * as React from "react";

import { IView, IViewCarousel, IViewCarouselElement } from 'src/ui/ConfigurationList';
import VirtualMonitor from 'src/ui/VirtualMonitor';

interface IProps {
  viewCarousel: IViewCarousel,
};

interface IState {
  carouselTimeout?: number,
  carouselLoopTime: number,
};

class ViewCarousel extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      carouselLoopTime: this.getTotalCarouselTime(),
      carouselTimeout: undefined,
    };
  }

  public componentDidMount() {
    this.setState({
      carouselTimeout: this.createTransitionTimeout(),
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.viewCarousel !== prevProps.viewCarousel) {
      if (this.state.carouselTimeout !== undefined) {
        clearTimeout(this.state.carouselTimeout);
      }
      this.setState ({
        carouselLoopTime: this.getTotalCarouselTime(),
        carouselTimeout: this.createTransitionTimeout(),
      })
    }
  };

  public componentWillUnmount() {
    if (this.state.carouselTimeout !== undefined) {
      clearTimeout(this.state.carouselTimeout);
      this.setState({ carouselTimeout: undefined });
    }
  }

  public render() {
    if (!this.props.viewCarousel || this.props.viewCarousel.length === 0) {
      return (<div>No carousel entries</div>)
    }

    const currentView = this.getCurrentView();

    return(
      <VirtualMonitor
        stops={Object.values(currentView.stops).map(stop => stop.gtfsId)}
        overrideStopNames={
          Object.values(currentView.stops).filter(stop => stop.overrideStopName)
          .reduce((acc, {gtfsId, overrideStopName}) => ({...acc, [gtfsId]: overrideStopName}), {})
        }
        displayedRoutes={7}
        title={currentView.title!.fi}
      />
    );
  };

  public getTotalCarouselTime() {
    return this.props.viewCarousel.reduce((totalTime: number, viewCarouselElement: IViewCarouselElement) => totalTime + viewCarouselElement.displayTime, 0);
  }

  public getTimeToNextTransition(): number {
    const redFunc = (timeAcc: number, view: IViewCarouselElement) => 
      timeAcc > 0 ? timeAcc - view.displayTime : timeAcc;
    
    const timeToTransition = -1 * this.props.viewCarousel.reduce(redFunc, Date.now() % this.state.carouselLoopTime) ;
    return timeToTransition;
  }

  public createTransitionTimeout(): number | undefined {
    if (!this.state.carouselLoopTime) {
      return undefined;
    }
    const nextTransition = this.getTimeToNextTransition();
    return window.setTimeout(this.transition.bind(this), nextTransition, nextTransition);
  }

  public transition() {
    this.setState({
      carouselTimeout: this.createTransitionTimeout(),
    });
  }

  protected getCurrentView(): IView {
    const redFunc = ({ displayedViewCarouselElement, timeAcc }: { displayedViewCarouselElement?: IViewCarouselElement, timeAcc: number }, view: IViewCarouselElement) => ({
      displayedViewCarouselElement: timeAcc >= 0 ? view : displayedViewCarouselElement,
      timeAcc: timeAcc - view.displayTime,
    });
    
    const { displayedViewCarouselElement }: { displayedViewCarouselElement?: IViewCarouselElement, timeAcc: number } = this.props.viewCarousel.reduce(redFunc, { displayedViewCarouselElement: undefined, timeAcc: Date.now() % this.state.carouselLoopTime });

    return (displayedViewCarouselElement || this.props.viewCarousel[0] || {}).view;
  }
};

export default ViewCarousel;
