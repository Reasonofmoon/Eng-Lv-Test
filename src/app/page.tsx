import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#F5F5F5]">
      <Card className="w-full max-w-2xl text-center bg-white rounded-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-[#4A90E2]">English Proficiency Test</CardTitle>
          <CardDescription className="text-lg">Assess your English language skills</CardDescription>
        </CardHeader>
        <CardContent className="text-left space-y-4 mb-8 text-gray-700">
          <p><strong className="text-[#4A90E2]">Total Questions:</strong> 60</p>
          <p><strong className="text-[#4A90E2]">Sections:</strong> Vocabulary, Grammar, Reading, Listening</p>
          <p><strong className="text-[#4A90E2]">Estimated Time:</strong> 40 minutes</p>
          <p><strong className="text-[#4A90E2]">Instructions:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Ensure a stable internet connection.</li>
            <li>For listening questions, ensure your audio is working.</li>
            <li>Once the test starts, a timer will begin.</li>
            <li>Do not refresh the page during the test.</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/test" className="w-full">
            <Button className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold py-3 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105">
              Start Test
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center">
        <Link href="/admin" className="text-[#4A90E2] hover:underline">
          Admin Panel (Add/Edit Questions)
        </Link>
      </div>
    </main>
  )
}
