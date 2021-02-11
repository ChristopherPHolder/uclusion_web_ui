import React from 'react'
import config from '../../config'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/polyfill-locales'
import { withA2HS } from 'a2hs'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../toast.css';
import { MarketsProvider } from '../../contexts/MarketsContext/MarketsContext'
import { InvestiblesProvider } from '../../contexts/InvestibesContext/InvestiblesContext'
import { LocaleProvider } from '../../contexts/LocaleContext'
import { CommentsProvider } from '../../contexts/CommentsContext/CommentsContext'
import { NotificationsProvider } from '../../contexts/NotificationsContext/NotificationsContext'
import { MarketPresencesProvider } from '../../contexts/MarketPresencesContext/MarketPresencesContext'
import { MarketStagesProvider } from '../../contexts/MarketStagesContext/MarketStagesContext'
import { VersionsProvider } from '../../contexts/VersionsContext/VersionsContext'
import AppWithAuth from '../App/AppWithAuth'
import { OperationInProgressProvider } from '../../contexts/OperationInProgressContext/OperationInProgressContext'
import OperationInProgressGlobalProvider from '../../components/ContextHacks/OperationInProgressGlobalProvider'
import { DiffProvider } from '../../contexts/DiffContext/DiffContext'
import { AccountProvider } from '../../contexts/AccountContext/AccountContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { SearchIndexProvider } from '../../contexts/SearchIndexContext/SearchIndexContext'
import { DismissTextProvider } from '../../contexts/DismissTextContext'
import { SearchResultsProvider } from '../../contexts/SearchResultsContext/SearchResultsContext'
import { ScrollProvider } from '../../contexts/ScrollContext'
import { ExpandedCommentProvider } from '../../contexts/CommentsContext/ExpandedCommentContext'
import { LeaderProvider } from '../../contexts/LeaderContext/LeaderContext'
import { NonParticipantsMarketsProvider } from '../../contexts/NonParticipantMarketsContext/NonParticipantMarketsContext'
import { TicketIndexProvider } from '../../contexts/TicketContext/TicketIndexContext'

function Main (props) {
  const stripePromise = loadStripe(config.payments.stripeKey);
  return (
    <div>
      <LeaderProvider>
        <AccountProvider>
          <DismissTextProvider>
            <ExpandedCommentProvider>
              <TicketIndexProvider>
                <SearchIndexProvider>
                  <SearchResultsProvider>
                    <DiffProvider>
                      <OperationInProgressProvider>
                        <OperationInProgressGlobalProvider>
                          <VersionsProvider>
                            <ScrollProvider>
                              <NotificationsProvider>
                                <NonParticipantsMarketsProvider>
                                  <MarketsProvider>
                                    <MarketStagesProvider>
                                      <CommentsProvider>
                                        <InvestiblesProvider>
                                          <MarketPresencesProvider>
                                            <LocaleProvider>
                                              <ToastContainer position="top-center" pauseOnFocusLoss={false}/>
                                              <Elements stripe={stripePromise}>
                                                <AppWithAuth/>
                                              </Elements>
                                            </LocaleProvider>
                                          </MarketPresencesProvider>
                                        </InvestiblesProvider>
                                      </CommentsProvider>
                                    </MarketStagesProvider>
                                  </MarketsProvider>
                                </NonParticipantsMarketsProvider>
                              </NotificationsProvider>
                            </ScrollProvider>
                          </VersionsProvider>
                        </OperationInProgressGlobalProvider>
                      </OperationInProgressProvider>
                    </DiffProvider>
                  </SearchResultsProvider>
                </SearchIndexProvider>
              </TicketIndexProvider>
            </ExpandedCommentProvider>
          </DismissTextProvider>
        </AccountProvider>
      </LeaderProvider>
    </div>
  );
}

export default withA2HS(Main);
