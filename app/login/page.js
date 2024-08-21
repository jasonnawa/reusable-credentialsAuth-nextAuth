'use client'
import Link from "next/link"
import { Box, Button, Flex, Heading, HStack, Input, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Login = ()=>{
    const router = useRouter()

    const {data: session, status: sessionStatus} = useSession()
    console.log(session)
    console.log(sessionStatus)

    useEffect(()=>{
        if (sessionStatus === 'authenticated'){
            router.push('/dashboard')
        }
    }, [sessionStatus, router])
    
    const toast = useToast()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const username = e.target[0].value
        const password = e.target[1].value

        if(!username || !password){
             return toast({
                title: "Please fill all fields.",
                status: 'error',
                position: 'top-right',
                duration: 1500,
                isClosable: true,
              })
        }

        try {
            const res = await signIn('credentials', {
                redirect : false,
                username, password
            })

            if(res.status==200){
                return toast({
                    title: "Successsfully logged in.",
                    status: 'success',
                    position: 'top-right',
                    duration: 2500,
                    isClosable: true,
                  })
            }else if(res.status == 403){
                return  toast({
                    title: "user could not be found.",
                    status: 'error',
                    position: 'top-right',
                    duration: 2500,
                    isClosable: true,
                  })
            }else if(res.status == 401){
               return  toast({
                    title: "incorrect password provided.",
                    status: 'error',
                    position: 'top-right',
                    duration: 2500,
                    isClosable: true,
                  })
                }
            
        } catch (error) {
            throw new Error(error);
            
        }


    }


    return sessionStatus !== 'authenticated' &&  (
        
            <Flex height="100vh" bg="grey" justifyContent="center" align="center">
            <Box bg="white" p={8} color="black">
                <Heading fontSize={30}>Login</Heading>

                <Box mt={5}>
                <form onSubmit={handleSubmit} >
                   
                    <HStack as="div" flexDir="column" >
            
                    <Input  placeholder="username" type="text" name="username"/>
                    <Input  placeholder="password" type="password" name="password" />
                    
                    </HStack>
                    
                    <Box mt={4} mb={2} width="100%">
                        <Button  type="submit" py={5} px={3} bg="black" color="white" width="100%">Login</Button>
                    </Box>

                    <span>
                       <small> Dont have an account?</small>
                       <Link href="/register">
                       <small> <u>register</u></small>
                       </Link>
                    </span>
                
                </form>

                </Box>

                
                
            </Box>
        </Flex>
        )
    
}

export default Login